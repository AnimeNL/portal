// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Floor } from './Floor';
import { ILocation } from './api/ILocation';
import { ProgramSession } from './ProgramSession';

/**
 * Represents a location of the event.
 */
export class Location {
    info: ILocation;
    floor_: Floor;
    sessions_: ProgramSession[];

    constructor(info: ILocation, floor: Floor) {
        this.info = info;

        this.floor_ = floor;
        this.floor_.addLocation(this);

        this.sessions_ = [];
    }

    /**
     * Adds the given |session| to the list of session that happen in this location.
     */
    addSession(session: ProgramSession): void {
        this.sessions_.push(session);
    }

    /**
     * Id (number) of the location. Must be unique.
     */
    get id(): number {
        return this.info.id;
    }

    /**
     * The floor where this location is.
     */
    get floor(): Floor {
        return this.floor_;
    }

    /**
     * Label describing the name of the location.
     */
    get label(): string {
        return this.info.label;
    }

    /**
     * Gets the array of sessions that will take place in this location.
     */
    get sessions(): ProgramSession[] {
        return this.sessions_;
    }
}
