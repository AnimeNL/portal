// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';
import { LabeledSessionList } from '../components/LabeledSessionList';
import { Location } from '../app/Location';
import { PageHeader, PageHeaderDefaults, PageHeaderProps } from '../components/PageHeader';
import { TimedListItem, TimedListItemProps } from '../components/TimedListItem';
import { UpdateTimeTracker } from '../components/UpdateTimeTracker';
import { getFloorDescription } from '../app/util/getDescription';
import slug from '../app/util/Slug';

/**
 * Properties accepted by the <LocationSchedulePage> element.
 */
interface Properties {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * The location for which this page is being rendered.
     */
    location: Location;
}

/**
 * TimedListItemProps, with a `key` field to ensure uniqueness in the list.
 */
type SessionDisplayInfo = TimedListItemProps & { key: string };

/**
 * Information necessary to render a section containing sessions for a particular day.
 */
interface SessionDayDisplayInfo {
    /**
     * Title identifying the day during which these sessions will take place.
     */
    label: string;

    /**
     * The number of sessions that have not yet finished.
     */
    pending: number;

    /**
     * Array with the sessions that will take place on this day. Must be sorted.
     */
    sessions: SessionDisplayInfo[];

    /**
     * UNIX timestamp of the time at which this day starts.
     */
    timestamp: number;
}

/**
 * State of the <LocationSchedulePage> element. Will be updated on navigation, and periodically when
 * the state of one of the events in this location is changing.
 */
interface State {
    /**
     * Information necessary to render the header of the location page.
     */
    header: PageHeaderProps;

    /**
     * Array of the various days during which sessions will take place in this location.
     */
    days: SessionDayDisplayInfo[];

    /**
     * Moment at which the next automated update of this page should occur.
     */
    nextUpdate?: moment.Moment;
}

/**
 * The location page displays an overview of a particular location, focused on the events that will
 * take place in that location. Events with volunteer coverage will be highlighted.
 */
class LocationSchedulePage extends React.Component<Properties, State> {
    updateTimer?: NodeJS.Timeout;
    state: State = {
        header: PageHeaderDefaults,
        days: []
    };

    componentDidMount() { this.refreshUpdateTimer(); }
    componentDidUpdate() { this.refreshUpdateTimer(); }

    /**
     * Determine whether this page should be updated based on the proposed changes. Use a naive
     * algorithm that only updates when either the location changes, or the next-update time is in
     * the past, indicating that an update should've occurred.
     */
    shouldComponentUpdate(nextProps: Properties, nextState: State): boolean {
        const { location } = this.props;
        const { nextUpdate } = this.state;

        if (nextProps.location !== location)
            return true;

        if (nextState.nextUpdate !== nextUpdate)
            return true;

        return false;
    }

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
        this.setState(LocationSchedulePage.getDerivedStateFromProps(this.props));
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
        const { clock, location } = props;
        const { floor, sessions } = location;

        const currentTime = clock.getMoment();

        let nextScheduleUpdate = currentTime.clone().add({ years: 1 });;

        // Compile the information necessary to display the header.
        const floorIdentifier = getFloorDescription(floor);
        const sessionCount = sessions.length + ' session' + (sessions.length !== 1 ? 's' : '');

        const days: Map<number, SessionDayDisplayInfo> = new Map();
        const header: PageHeaderProps = {
            icon: floor.icon || undefined,
            iconColor: floor.iconColor,
            subtitle: floorIdentifier + ' — ' + sessionCount,
            title: location.label,
        };

        for (const session of sessions) {
            const state = session.beginTime > currentTime
                              ? 'pending'
                              : (session.endTime < currentTime ? 'past' : 'active');

            const sessionDisplayInfo: SessionDisplayInfo = {
                beginTime: session.beginTime,
                endTime: session.endTime,
                description: session.description || undefined,
                internal: session.event.internal,
                state: state,
                title: session.name,
                to: '/schedule/events/' + session.event.id + '/' + slug(session.name),

                // The key for this |session| will be the event ID together with the begin time of
                // the session on the schedule. This should hopefully be globally unique.
                key: `${session.event.id}-${session.beginTime.unix()}`,
            };

            const activeIncrement = state !== 'past' ? 1 : 0;

            // Consider this |session| for scheduling the next page update.
            switch (state) {
                case 'active':
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, session.endTime);
                    break;
                case 'pending':
                    nextScheduleUpdate = moment.min(nextScheduleUpdate, session.beginTime);
                    break;
            }

            // Gets an identifier for the current day consistent throughout the sessions. A UNIX
            // timestamp is used rather than a Moment instance as Map can store multiple of those.
            const dayIdentifier = moment(session.beginTime).startOf('day').unix();
            const day = days.get(dayIdentifier);

            if (day) {
                day.sessions.push(sessionDisplayInfo);
                day.pending += activeIncrement;
            } else {
                days.set(dayIdentifier, {
                    label: session.beginTime.format('dddd'),
                    pending: activeIncrement,
                    sessions: [ sessionDisplayInfo ],
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
            displayInfo.sessions.sort((lhs, rhs) => {
                if (lhs.endTime < currentTime && rhs.endTime >= currentTime)
                    return 1;
                if (rhs.endTime < currentTime && lhs.endTime >= currentTime)
                    return -1;

                return lhs.beginTime > rhs.beginTime ? 1 : -1;
            });
        }

        return {
            header,
            days: sortedDays,
            nextUpdate: nextScheduleUpdate,
        };
    }

    render() {
        const { header, days, nextUpdate } = this.state;

        return (
            <React.Fragment>

                <PageHeader {...header} />

                { days.map(day =>
                    <LabeledSessionList key={day.label} label={day.label}>

                        { day.sessions.map(session =>
                            <TimedListItem {...session} /> )}

                    </LabeledSessionList>
                ) }

                <UpdateTimeTracker label={header.title} moment={nextUpdate} />

            </React.Fragment>
        );
    }
}

export { LocationSchedulePage };
