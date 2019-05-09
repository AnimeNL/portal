// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IVolunteerInfo } from './api/IVolunteerInfo';
import { VolunteerGroup } from './VolunteerGroup';

/**
 * Represents an individual group of volunteers.
 */
export class Volunteer {
    info: IVolunteerInfo;
    volunteerGroup: VolunteerGroup;

    constructor(info: IVolunteerInfo, volunteerGroup: VolunteerGroup) {
        this.info = info;
        this.volunteerGroup = volunteerGroup;
    }

    /**
     * The token that uniquely identifies this volunteer.
     */
    get userToken(): string {
        return this.info.userToken;
    }

    /**
     * The group that this volunteer is part of.
     */
    get group(): VolunteerGroup {
        return this.volunteerGroup;
    }

    /**
     * The full name of this volunteer.
     */
    get name(): string {
        return this.info.name;
    }

    /**
     * URL to the avatar that's to be displayed for this volunteer, if any.
     */
    get avatar(): string | undefined {
        return this.info.avatar || undefined;
    }

    /**
     * Title to be displayed for this volunteer.
     */
    get title(): string {
        return this.info.title;
    }

    /**
     * Access code of this volunteer. Access is restricted by the server.
     */
    get accessCode(): string | null {
        return this.info.accessCode;
    }

    /**
     * Telephone number of this volunteer. Access is restricted by the server.
     */
    get telephone(): string | null {
        return this.info.telephone;
    }
}
