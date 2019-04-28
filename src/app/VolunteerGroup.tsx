// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IVolunteerGroup } from './api/IVolunteerGroup';

/**
 * Represents an individual group of volunteers.
 */
export class VolunteerGroup {
    info: IVolunteerGroup;

    constructor(info: IVolunteerGroup) {
        this.info = info;
    }

    /**
     * Whether this group is the primary group of interest to the logged in user.
     */
    get primary(): boolean {
        return this.info.primary;
    }


    /**
     * Label describing the group of volunteers.
     */
    get label(): string {
        return this.info.label;
    }
}
