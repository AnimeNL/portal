// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import bind from 'bind-decorator';
import moment from 'moment';

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

    /**
     * Timer responsible for keeping the volunteer status up to date.
     */
    updateTimer?: NodeJS.Timeout;

    constructor(volunteers: Map<string, Volunteer>, clock: Clock) {
        this.clock = clock;
        this.clock.addObserver(this.update);

        this.volunteers = volunteers;
        this.update();

        document.addEventListener('visibilitychange', this.updateIfWindowBecameVisible);
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
     * Listens to visibility change events of the current window. If the window became visible again
     * the activity state should be updated, as timers might've been suspended by the browser.
     */
    @bind
    updateIfWindowBecameVisible(): void {
        if (document.visibilityState === 'visible')
            this.update();
    }

    /**
     * Updates the volunteer activity state for all volunteers known to the portal.
     */
    @bind
    async update(): Promise<void> {
        const activeShiftsForGroup: Map<VolunteerGroup, number> = new Map();
        const activityInfoForVolunteer: Map<Volunteer, VolunteerActivityInfo> = new Map();
        const currentTime = this.clock.getMoment();

        if (this.updateTimer)
            clearTimeout(this.updateTimer);

        let nextUpdate = currentTime.clone().add({ years: 1 });

        for (const volunteer of this.volunteers.values()) {
            const volunteerGroup = volunteer.group;

            let currentShift: Shift | undefined;
            let upcomingShift: Shift | undefined;

            for (const shift of volunteer.shifts) {
                if (shift.endTime < currentTime)
                    continue;  // in the past
                
                if (shift.beginTime <= currentTime) {
                    nextUpdate = moment.min(nextUpdate, shift.endTime);
                    currentShift = shift;
                    continue;
                } else {
                    nextUpdate = moment.min(nextUpdate, shift.beginTime);
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

        this.updateTimer = setTimeout(this.update, nextUpdate.diff(currentTime));

        this.activeShiftsForGroup = activeShiftsForGroup;
        this.activityInfoForVolunteer = activityInfoForVolunteer;
    }
}
