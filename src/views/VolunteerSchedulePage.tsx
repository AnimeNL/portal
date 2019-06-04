// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';
import { LabeledSessionList } from '../components/LabeledSessionList';
import { TimedListItem, TimedListItemProps } from '../components/TimedListItem';
import { UpdateTimeTracker } from '../components/UpdateTimeTracker';
import { Volunteer } from '../app/Volunteer';
import VolunteerListItem from '../components/VolunteerListItem';
import { getState } from '../app/util/getState';
import slug from '../app/util/Slug';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

/**
 * Properties accepted by the <VolunteerSchedulePage> element.
 */
interface Properties {
    /**
     * Clock used to determine the active and upcoming shifts for this page.
     */
    clock: Clock;

    /**
     * The volunteer for whom this page is being displayed.
     */
    volunteer: Volunteer;

    /**
     * An event that is to be invoked if the photo of the |volunteer| has been updated. The ability
     * to change the photo will be enabled based on whether this property has been set.
     */
    onPictureUpdated?: (imageData: string) => Promise<boolean>;
}

/**
 * TimedListItemProps, with a `key` field to ensure uniqueness in the list.
 */
type ShiftDisplayInfo = TimedListItemProps & { key: string };

/**
 * Information necessary to render a section containing shifts for a particular day.
 */
interface ShiftDayDisplayInfo {
    /**
     * Title identifying the day during which these shifts will take place.
     */
    label: string;

    /**
     * The number of shifts that have not yet finished.
     */
    pending: number;

    /**
     * Array with the shifts that will take place on this day. Must be sorted.
     */
    shifts: ShiftDisplayInfo[];

    /**
     * UNIX timestamp of the time at which this day starts.
     */
    timestamp: number;
}

/**
 * State of the <VolunteerSchedulePage> component.
 */
interface State {
    /**
     * Array of the various days during which shifts will take place in this location.
     */
    days: ShiftDayDisplayInfo[];

    /**
     * Moment at which the next automated update of this page should occur.
     */
    nextUpdate?: moment.Moment;
}

/**
 * The <VolunteerSchedulePage> component displays the schedule for a particular volunteer. Some
 * users will also be able to update the photo associated with this volunteer here.
 */
class VolunteerSchedulePage extends React.Component<Properties, State> {
    updateTimer?: NodeJS.Timeout;
    state: State = {
        days: [],
    }

    componentDidMount() { this.refreshUpdateTimer(); }
    componentDidUpdate() { this.refreshUpdateTimer(); }

    /**
     * Refreshes the |updateTimer| by clearing the current one and setting a new one.
     */
    private refreshUpdateTimer() {
        const { clock } = this.props;
        const { nextUpdate } = this.state;

        if (this.updateTimer)
            clearTimeout(this.updateTimer);

        // It's possible that there are no future updates, for example when the last shift for this
        // volunteer has been finished already.
        if (!nextUpdate)
            return;

        this.updateTimer = setTimeout(this.refreshState, nextUpdate.diff(clock.getMoment()));
    }

    /**
     * Called by the |updateTimer| as an event listed on the page has finished or is about to start.
     */
    @bind
    private refreshState() {
        this.setState(VolunteerSchedulePage.getDerivedStateFromProps(this.props));
        this.refreshUpdateTimer();
    }

    componentWillUnmount() {
        if (this.updateTimer)
            clearTimeout(this.updateTimer);
    }

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        const { clock, volunteer } = props;

        const currentTime = clock.getMoment();
        const days: Map<number, ShiftDayDisplayInfo> = new Map();

        let nextScheduleUpdate = currentTime.clone().add({ years: 1 });;

        for (const shift of volunteer.shifts) {
            if (!shift.isEvent())
                continue;

            const event = shift.event;
            const session = event.sessions[0];

            // TODO: Should we display volunteer availability on this page?

            const state = getState(currentTime, shift);
            const stateIncrement = state === 'past' ? 0 : 1;

            const shiftDisplayInfo: ShiftDisplayInfo = {
                beginTime: shift.beginTime,
                endTime: shift.endTime,
                description: session.description || undefined,
                internal: event.internal,
                state: state,
                title: session.name,
                to: '/schedule/events/' + event.id + '/' + slug(session.name),

                // The key for this |event| will be the event ID together with the begin time of
                // the shift on the schedule. This should hopefully be globally unique.
                key: `${event.id}-${shift.beginTime.unix()}`,
            };

            // Consider this |session| for scheduling the next page update.
            switch (state) {
                case 'active':
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, shift.endTime);
                    break;
                case 'pending':
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, shift.beginTime);
                    break;
            }

            // Gets an identifier for the current day consistent throughout the sessions. A UNIX
            // timestamp is used rather than a Moment instance as Map can store multiple of those.
            const dayIdentifier = moment(shift.beginTime).startOf('day').unix();
            const day = days.get(dayIdentifier);

            if (day) {
                day.shifts.push(shiftDisplayInfo);
                day.pending += stateIncrement;
            } else {
                days.set(dayIdentifier, {
                    label: shift.beginTime.format('dddd'),
                    pending: stateIncrement,
                    shifts: [ shiftDisplayInfo ],
                    timestamp: dayIdentifier,
                });
            }
        }

        // (1) Sort the days that are to be displayed on the location page.
        const sortedDays = Array.from(days.values()).sort((lhs, rhs) => {
            if (!lhs.pending && rhs.pending)
                return -1;
            if (!rhs.pending && lhs.pending)
                return -1;

            return lhs.timestamp > rhs.timestamp ? 1 : -1;
        });

        // (2) Sort the events within the days that will be displayed on the page.
        for (const displayInfo of sortedDays) {
            displayInfo.shifts.sort((lhs, rhs) => {
                if (lhs.endTime < currentTime && rhs.endTime >= currentTime)
                    return 1;
                if (rhs.endTime < currentTime && lhs.endTime >= currentTime)
                    return -1;

                return lhs.beginTime > rhs.beginTime ? 1 : -1;
            });
        }

        return {
            days: sortedDays,
            nextUpdate: nextScheduleUpdate
        };
    }

    render() {
        const { onPictureUpdated, volunteer } = this.props;
        const { days, nextUpdate } = this.state;

        return (
            <React.Fragment>

                <Paper square>
                    <List>
                        <VolunteerListItem onPictureUpdated={onPictureUpdated}
                                           volunteer={volunteer}
                                           type="header" />
                    </List>
                </Paper>

                { days.map(day =>
                    <LabeledSessionList key={day.label} label={day.label}>

                        { day.shifts.map(shift =>
                            <TimedListItem {...shift} /> )}

                    </LabeledSessionList>
                ) }

                <UpdateTimeTracker label={volunteer.name} moment={nextUpdate} />

            </React.Fragment>
        );
    }
}

export { VolunteerSchedulePage };
