// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IFloor } from './api/IFloor';
import { Location } from './Location';

/**
 * Represents a floor or area of the event.
 */
export class Floor {
    info: IFloor;
    locations_: Location[];

    constructor(info: IFloor) {
        this.info = info;
        this.locations_ = [];
    }

    /**
     * Adds the given |location| to the list of locations that exist on this floor.
     */
    addLocation(location: Location): void {
        this.locations_.push(location);
    }

    /**
     * Id (number) of the floor. Usually begins with zero.
     */
    get id(): number {
        return this.info.id;
    }

    /**
     * Label describing the name of the floor.
     */
    get label(): string {
        return this.info.label;
    }

    /**
     * Gets an array with the locations that are part of this floor.
     */
    get locations(): Location[] {
        return this.locations_;
    }

    /**
     * Color (CSS value) that should be applied to the floor and its icons.
     */
    get iconColor(): string | undefined {
        return this.info.iconColor || undefined;
    }

    /**
     * URL to an icon that should be displayed for this floor. Optional.
     */
    get icon(): string | null {
        return this.info.icon;
    }
}
