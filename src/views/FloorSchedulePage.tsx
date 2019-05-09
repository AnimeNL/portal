// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Clock from '../app/Clock';
import { Floor } from '../app/Floor';
import { Location } from '../app/Location';
import { LocationCard } from '../components/LocationCard';
import { LocationFinished } from '../components/LocationFinished';
import { LocationSession } from '../components/LocationSession';
import { ProgramSession } from '../app/ProgramSession';
import slug from '../app/util/Slug';

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
 * Properties required to appropriately display a session on the location card.
 */
interface SessionDisplayInfo {
    /**
     * The program session that's about to be displayed on this page.
     */
    session: ProgramSession;

    /**
     * The class name that should be used to control presentation of this session.
     */
    className: string;
}

/**
 * The floor schedule page is responsible for displaying the locations available on a particular
 * floor, together with the events that are happening in them at the current time.
 */
export class FloorSchedulePage extends React.Component<Properties> {
    /**
     * Creates the selection of sessions that should be displayed for the given |location|. A
     * maximum of |kMaximumActiveSessions| will be returned, preferring active ones, then proceeding
     * with upcoming sessions. An empty array will be returned if there are no more sessions.
     */
    private createSessionSelectionForLocation(location: Location): SessionDisplayInfo[] {
        const { clock } = this.props;

        const currentTime = clock.getMoment();
        const selection: SessionDisplayInfo[] = [];

        // Create a sorted list of all the sessions in the |location| by their starting time.
        const sessions = Array.from(location.sessions).sort((lhs, rhs) => {
            return lhs.beginTime > rhs.beginTime ? 1 : -1;
        });

        // Select the |kMaximumActiveSessions| first sessions that aren't in the past.
        for (const session of sessions) {
            if (session.endTime < currentTime)
                continue;

            const className = 'fixme';

            selection.push({ session, className });

            if (selection.length >= kMaximumActiveSessions)
                break;
        }

        return selection;
    }

    render() {
        const { floor } = this.props;

        // Create a sorted list (by label) of the locations on this floor.
        const locations = Array.from(floor.locations).sort((lhs, rhs) => {
            return lhs.label.localeCompare(rhs.label);
        });

        return (
            <React.Fragment>

                { locations.map(location => {

                    const path = '/schedule/locations/' + location.id + '/' + slug(location.label);
                    const sessions = this.createSessionSelectionForLocation(location);

                    return (
                        <LocationCard name={location.label} to={path}>

                            { sessions.map(displayInfo =>
                                <LocationSession label={displayInfo.session.name}
                                                 state="active" />
                            ) }

                            { !sessions.length && <LocationFinished /> }

                        </LocationCard>
                    );

                }) }

            </React.Fragment>
        );
    }
}
