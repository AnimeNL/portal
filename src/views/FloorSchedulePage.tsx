// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Clock from '../app/Clock';
import { Floor } from '../app/Floor';
import { LocationCard } from '../components/LocationCard';
import { LocationFinished } from '../components/LocationFinished';
import { LocationSession } from '../components/LocationSession';
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
 * Interface of the details that must be known to display a location's session.
 */
interface SessionDisplayInfo {
    /**
     * Whether this session is internal, meaning that it's not been announced to the public.
     */
    internal?: boolean;

    /**
     * Label of the session that this element is describing.
     */
    label: string;

    /**
     * Whether the session described by this list item is active, or still pending.
     */
    state: "active" | "pending";

    /**
     * Timing, if any, to display as part of this element.
     */
    timing?: string;
}

/**
 * Interface of the details that must be known to display an individual location.
 */
interface LocationDisplayInfo {
    /**
     * Whether this location is internal, meaning that it's not been announced to the public.
     */
    internal?: boolean;

    /**
     * Name to display that identifies this location.
     */
    label: string;

    /**
     * Sorted list of SessionDisplayInfo objects.
     */
    sessions: SessionDisplayInfo[];

    /**
     * URL of the page that the user should be linked to after clicking on the location.
     */
    to: string;
}

/**
 * State of the <FloorSchedulePage> element. Will be periodically updated.
 */
interface State {
    /**
     * Sorted list of LocationDisplayInfo objects.
     */
    locations: LocationDisplayInfo[];
}

/**
 * The floor schedule page is responsible for displaying the locations available on a particular
 * floor, together with the events that are happening in them at the current time.
 */
export class FloorSchedulePage extends React.Component<Properties, State> {
    state: State = {
        locations: []
    }

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        const { clock, floor } = props;

        const currentTime = clock.getMoment();
        const locations: LocationDisplayInfo[] = [];

        for (const location of floor.locations) {
            const sessions: SessionDisplayInfo[] = [];
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

                sessions.push({
                    internal: undefined,
                    label: session.name,
                    state: 'active',
                    timing: undefined,
                });

                if (sessions.length >= kMaximumActiveSessions)
                    break;
            }

            locations.push({
                internal: undefined,
                label: location.label,
                sessions, to
            });
        }

        locations.sort((lhs, rhs) => lhs.label.localeCompare(rhs.label));

        return { locations };
    }

    render() {
        const { locations } = this.state;

        return (
            <React.Fragment>
                { locations.map(location => {
                    return (
                        <LocationCard internal={location.internal}
                                      name={location.label}
                                      to={location.to}>

                            { location.sessions.map(session =>
                                <LocationSession internal={session.internal}
                                                 label={session.label}
                                                 state={session.state}
                                                 timing={session.timing} />
                            ) }

                            { !location.sessions.length && <LocationFinished /> }

                        </LocationCard>
                    );
                }) }
            </React.Fragment>
        );
    }
}
