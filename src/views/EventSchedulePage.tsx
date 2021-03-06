// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';
import { LabeledSessionList } from '../components/LabeledSessionList';
import { ExpandableDescriptionPaper } from '../components/ExpandableDescriptionPaper';
import { PageHeader, PageHeaderDefaults, PageHeaderProps } from '../components/PageHeader';
import { ProgramEvent } from '../app/ProgramEvent';
import { SessionListItem, SessionListItemProps } from '../components/SessionListItem';
import { ShiftListItem, ShiftListItemProps } from '../components/ShiftListItem';
import { UpdateTimeTracker } from '../components/UpdateTimeTracker';
import { getLocationDescription } from '../app/util/getDescription';

/**
 * Properties accepted by the <EventSchedulePage> component.
 */
interface Properties {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * The event for which this page is being rendered.
     */
    event: ProgramEvent;

    /**
     * Whether the user is able to change the description of this event.
     */
    mutable?: boolean;

    /**
     * Event that should be called when the description for the current event changes.
     */
    onDescriptionChange: (description: string) => Promise<boolean>;
}

/**
 * SessionListItemProps, with a `key` field to ensure uniqueness in the list.
 */
type SessionDisplayInfo = SessionListItemProps & { key: string };

/**
 * ShiftListItemProps, with a `key` field to ensure uniqueness in the list.
 */
type ShiftDisplayInfo = ShiftListItemProps & { key: string };

/**
 * State of the event schedule page. Details both the header as the content that should be displayed
 * on the page, such as sessions and shifts w/ volunteers.
 */
interface State {
    /**
     * Description of the event, if there is one available.
     */
    description?: string;

    /**
     * Notes of the event, meant for usage by volunteers, if there is one available.
     */
    notes?: string;

    /**
     * Details required to display the page header.
     */
    header: PageHeaderProps;

    /**
     * List of sessions that will be hosted as part of this event.
     */
    sessions: SessionDisplayInfo[];

    /**
     * List of the shifts that will be taking place as part of this event.
     */
    shifts: ShiftDisplayInfo[];

    /**
     * Moment at which the next automated update of this page should occur.
     */
    nextUpdate?: moment.Moment;
}

/**
 * The event schedule page displays more information about an event, the information that's known
 * about it, as well as the sessions and volunteer shifts scheduled at it.
 */
class EventSchedulePage extends React.Component<Properties, State> {
    updateTimer?: NodeJS.Timeout;
    state: State = {
        header: PageHeaderDefaults,
        sessions: [],
        shifts: [],
    }

    componentDidMount() { this.refreshUpdateTimer(); }
    componentDidUpdate() { this.refreshUpdateTimer(); }

    /**
     * Refreshes the |updateTimer| by clearing the current one and setting a new one. This seems to
     * be necessary due to React's lifetime semantics.
     */
    private refreshUpdateTimer() {
        const { clock } = this.props;
        const { nextUpdate } = this.state;

        if (this.updateTimer)
            clearTimeout(this.updateTimer);

        // It's possible that there are no future updates, for example when the last session in this
        // location has passed already.
        if (!nextUpdate)
            return;

        this.updateTimer = setTimeout(this.refreshState, nextUpdate.diff(clock.getMoment()));
    }

    /**
     * Called by the |updateTimer| as an event listed on the page has finished or is about to start.
     */
    @bind
    private refreshState() {
        this.setState(EventSchedulePage.getDerivedStateFromProps(this.props));
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
        const { clock, event } = props;

        const currentTime = clock.getMoment();

        let nextScheduleUpdate = currentTime.clone().add({ years: 1 });

        const firstSession = event.sessions[0];
        const firstSessionFloor = firstSession.location.floor;

        // (1) Compile the information that's to be displayed in the page header.
        const header: PageHeaderProps = {
            icon: firstSessionFloor.icon || undefined,
            iconColor: firstSessionFloor.iconColor,
            subtitle: getLocationDescription(firstSession.location),
            title: firstSession.name,
        };

        // (2) If a description is available for this session, set it to the state.
        const description = firstSession.description || undefined;

        // (3) If notes are available, set them to the state as well.
        const notes = event.notes;

        // (4) Compile the list of sessions that are part of this event.
        const sessions: SessionDisplayInfo[] = [];
        event.sessions.forEach((session, index) => {
            const isPast = session.endTime.isBefore(currentTime);
            if (!isPast) {
                if (session.endTime.isAfter(currentTime))
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, session.endTime);
                else
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, session.beginTime);
            }

            sessions.push({
                beginTime: session.beginTime,
                endTime: session.endTime,
                past: isPast,
                key: index.toString()
            });
        });

        // (5) Compile the list of shifts that are part of this event.
        const shifts: ShiftDisplayInfo[] = [];
        event.shifts.forEach((shift, index) => {
            const isActive = currentTime.isBetween(shift.beginTime, shift.endTime);
            const isPast = shift.endTime.isBefore(currentTime);

            if (!isPast) {
                if (isActive)
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, shift.endTime);
                else
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, shift.beginTime);
            }

            shifts.push({
                beginTime: shift.beginTime,
                endTime: shift.endTime,
                active: isActive,
                past: isPast,
                today: shift.beginTime.isSame(currentTime, 'day'),
                volunteer: shift.volunteer,
                key: index.toString(),
            });
        });

        // (6) Sort the shifts based on when they'll be around for the event, then by name.
        const sortedShifts = shifts.sort((lhs, rhs) => {
            if (lhs.past && !rhs.past)
                return 1;
            if (rhs.past && !lhs.past)
                return -1;

            if (lhs.beginTime < rhs.beginTime)
                return -1;
            if (rhs.beginTime < lhs.beginTime)
                return 1;

            if (lhs.endTime < rhs.endTime)
                return -1;
            if (rhs.endTime < lhs.endTime)
                return 1;

            return lhs.volunteer.name.localeCompare(rhs.volunteer.name);
        });

        return { description, notes, header, sessions,
                 shifts: sortedShifts, nextUpdate: nextScheduleUpdate };
    }

    render() {
        const { mutable, onDescriptionChange } = this.props;
        const { description, header, notes, sessions, shifts, nextUpdate } = this.state;

        return (
            <React.Fragment>

                <PageHeader {...header} />

                { description &&
                    <ExpandableDescriptionPaper title="Event description" text={description} /> }

                { (notes || mutable) &&
                    <ExpandableDescriptionPaper markdown mutable={mutable}
                                                onDescriptionChange={onDescriptionChange}
                                                title="Shift instructions"
                                                text={notes} /> }

                <LabeledSessionList dense label="Sessions">
                    { sessions.map(session => <SessionListItem {...session} /> ) }
                </LabeledSessionList>

                { !!shifts.length &&
                    <LabeledSessionList dense label="Shifts">
                        { shifts.map(shift => <ShiftListItem {...shift} /> ) }
                    </LabeledSessionList> }

                <UpdateTimeTracker label={header.title} moment={nextUpdate} />

            </React.Fragment>
        );
    }
}

export { EventSchedulePage };
