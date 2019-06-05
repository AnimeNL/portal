// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Shift } from './Shift';
import { Volunteer } from './Volunteer';
import { VolunteerGroup } from './VolunteerGroup';

type VolunteerActivityInfo = { currentShift?: Shift; upcomingShift?: Shift; };

/**
 * Responsible for keeping track of the active and upcoming shifts for all volunteers. Supports
 * efficient O(1) amortized lookup times.
 */
export class VolunteerTracker {
    /**
     * Map of all volunteers. Instance is provided by the Event object.
     */
    volunteers: Map<string, Volunteer>;
    
    constructor(volunteers: Map<string, Volunteer>) {
        this.volunteers = volunteers;
    }

    /**
     * Returns the activity info for the given |volunteer|.
     */
    getActivityInfoForVolunteer(volunteer: Volunteer): VolunteerActivityInfo {
        return {};
    }

    /**
     * Returns the number of active shifts within the given |volunteerGroup|.
     */
    getActiveShiftsForGroup(volunteerGroup: VolunteerGroup): number {
        return 0;
    }
}
