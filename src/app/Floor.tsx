// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IFloor } from './api/IFloor';

/**
 * Represents a floor or area of the event.
 */
export class Floor {
    info: IFloor;

    constructor(info: IFloor) {
        this.info = info;
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
     * URL to an icon that should be displayed for this floor. Optional.
     */
    get icon(): string | null {
        return this.info.icon;
    }
}
