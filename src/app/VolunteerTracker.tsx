// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import bind from 'bind-decorator';

import Clock from './Clock';
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
     * The clock responsible for maintaining application time.
     */
    clock: Clock;

    /**
     * Map of all volunteers. Instance is provided by the Event object.
     */
    volunteers: Map<string, Volunteer>;
    
    /**
     * Map of volunteer groups to the number of active shifts for that group.
     */
    activeShiftsForGroup: Map<VolunteerGroup, number> = new Map();

    /**
     * Map of volunteers to their associated activity info, if any.
     */
    activityInfoForVolunteer: Map<Volunteer, VolunteerActivityInfo> = new Map();

    constructor(volunteers: Map<string, Volunteer>, clock: Clock) {
        this.clock = clock;
        this.clock.addObserver(this.onTimeChange);

        this.volunteers = volunteers;
        this.update();
    }

    /**
     * Returns the activity info for the given |volunteer|.
     */
    getActivityInfoForVolunteer(volunteer: Volunteer): VolunteerActivityInfo {
        return this.activityInfoForVolunteer.get(volunteer) || {};
    }

    /**
     * Returns the number of active shifts within the given |volunteerGroup|.
     */
    getActiveShiftsForGroup(volunteerGroup: VolunteerGroup): number {
        return this.activeShiftsForGroup.get(volunteerGroup) || 0;
    }

    /**
     *  Called when the time of the application changes.
     */
    @bind
    onTimeChange() {
        this.update();
    }

    /**
     * Updates the volunteer activity state for all volunteers known to the portal.
     */
    async update(): Promise<void> {
        const activeShiftsForGroup: Map<VolunteerGroup, number> = new Map();
        const activityInfoForVolunteer: Map<Volunteer, VolunteerActivityInfo> = new Map();
        const currentTime = this.clock.getMoment();

        for (const volunteer of this.volunteers.values()) {
            const volunteerGroup = volunteer.group;

            let currentShift: Shift | undefined;
            let upcomingShift: Shift | undefined;

            for (const shift of volunteer.shifts) {
                if (shift.endTime < currentTime)
                    continue;  // in the past
                
                if (shift.beginTime <= currentTime) {
                    currentShift = shift;
                    continue;
                } else {
                    upcomingShift = shift;
                    break;
                }
            }

            // (1) Increment the number of active shifts for the |volunteerGroup|.
            if (currentShift && currentShift.isEvent()) {
                activeShiftsForGroup.set(
                    volunteerGroup, (activeShiftsForGroup.get(volunteerGroup) || 0) + 1);
            }
            
            // (2) Store the activity information for the |volunteer|, if any.
            if (currentShift || upcomingShift)
                activityInfoForVolunteer.set(volunteer, { currentShift, upcomingShift });
        }

        this.activeShiftsForGroup = activeShiftsForGroup;
        this.activityInfoForVolunteer = activityInfoForVolunteer;
    }
}
