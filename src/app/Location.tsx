// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Floor } from './Floor';
import { ILocation } from './api/ILocation';

/**
 * Represents a location of the event.
 */
export class Location {
    info: ILocation;
    floor_: Floor;

    constructor(info: ILocation, floor: Floor) {
        this.info = info;
        this.floor_ = floor;
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
}
