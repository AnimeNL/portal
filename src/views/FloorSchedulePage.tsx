// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';
import { Floor } from '../app/Floor';
import { LocationCard, LocationCardProps } from '../components/LocationCard';
import { LocationFinished } from '../components/LocationFinished';
import { LocationSession, LocationSessionProps } from '../components/LocationSession';
import createSlug from '../app/util/Slug';

/**
 * Number of active sessions that will be displayed at most for a particular location.
 */
const kMaximumActiveSessions = 3;

/**
 * Properties accepted by the <FloorSchedulePage> element.
 */
interface Properties {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * The floor for which this page is being displayed.
     */
    floor: Floor;
}

/**
 * Interface of the details that must be known to display an individual location.
 */
interface LocationDisplayInfo {
    /**
     * Properties that influence display of the location card itself.
     */
    card: LocationCardProps;

    /**
     * Sorted list of session display properties.
     */
    sessions: LocationSessionProps[];
}

/**
 * State of the <FloorSchedulePage> element. Will be periodically updated.
 */
interface State {
    /**
     * Sorted list of LocationDisplayInfo objects.
     */
    locations: LocationDisplayInfo[];

    /**
     * Moment at which the next automated update of this page should occur.
     */
    nextUpdate?: moment.Moment;
}

/**
 * The floor schedule page is responsible for displaying the locations available on a particular
 * floor, together with the events that are happening in them at the current time.
 */
export class FloorSchedulePage extends React.Component<Properties, State> {
    updateTimer?: NodeJS.Timeout;
    state: State = {
        locations: [],
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

        // It's possible that there are no future updates, for example when the last session in a
        // room happened in the past. Bail out in that case.
        if (!nextUpdate)
            return;

        this.updateTimer = setTimeout(this.refreshState, nextUpdate.diff(clock.getMoment()));
    }

    /**
     * Called by the |updateTimer| as an event listed on the page has finished or is about to start.
     */
    @bind
    private refreshState() {
        this.setState(FloorSchedulePage.getDerivedStateFromProps(this.props));
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
        const { clock, floor } = props;

        const currentTime = clock.getMoment();

        let locations: LocationDisplayInfo[] = [];
        let nextScheduleUpdate = currentTime.clone().add({ years: 1 });;

        for (const location of floor.locations) {
            const sessions: LocationSessionProps[] = [];
            const to = '/schedule/locations/' + location.id + '/' + createSlug(location.label);

            // TODO: Doing this each time for each view is expensive. Perhaps we should have a one-
            // time sorting routine on the Location object?
            const sortedSessions = Array.from(location.sessions).sort((lhs, rhs) => {
                return lhs.beginTime > rhs.beginTime ? 1 : -1;
            });

            // Select the |kMaximumActiveSessions| first sessions that aren't in the past.
            for (const session of sortedSessions) {
                if (session.endTime < currentTime)
                    continue;

                const isActive = session.beginTime <= currentTime;
                const timing = isActive ? undefined
                                        : currentTime.to(session.beginTime);

                // Consider this |session| for scheduling the next page update.
                nextScheduleUpdate = moment.min(nextScheduleUpdate, isActive ? session.endTime
                                                                             : session.beginTime);

                sessions.push({
                    internal: session.event.internal,
                    label: session.name,
                    state: isActive ? 'active' : 'pending',
                    timing
                });

                if (sessions.length >= kMaximumActiveSessions)
                    break;
            }

            locations.push({
                card: {
                    internal: undefined,
                    label: location.label,
                    to,
                },
                sessions
            });
        }

        // Sort alphabetically. Locations without upcoming sessions will be listed last.
        locations.sort((lhs, rhs) => {
            if (!lhs.sessions.length && rhs.sessions.length)
                return 1;

            return lhs.card.label.localeCompare(rhs.card.label);
        });

        let nextUpdateSeconds = nextScheduleUpdate.diff(currentTime, 'seconds');
        let nextUpdate: number = 3600;

        // The next update depends on when the next schedule update happens, together with rounding
        // applied in MomentJS: https://momentjs.com/docs/#/displaying/fromnow/
        if (nextUpdateSeconds <= 44 * 60) {
            nextUpdate = 1 + (30 + nextUpdateSeconds) % 60;                // nearest X:30 minutes
        } else if (nextUpdateSeconds <= 21 * 60 * 60) {
            nextUpdate = Math.min(nextUpdateSeconds - 44 * 60,             // 44 minutes remaining
                                  1 + (1800 + nextUpdateSeconds) % 3600);  // nearest X:30 hours
        }

        return {
            locations,
            nextUpdate: clock.getMoment().add({ seconds: nextUpdate })
        };
    }

    render() {
        const { locations } = this.state;

        return (
            <React.Fragment>
                { locations.map(location => {
                    return (
                        <LocationCard {...location.card}>

                            { location.sessions.map(session => <LocationSession {...session} />) }
                            { !location.sessions.length && <LocationFinished /> }

                        </LocationCard>
                    );
                }) }
            </React.Fragment>
        );
    }
}
