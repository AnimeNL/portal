// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import EventLoader from './EventLoader';
import { IEvent } from './api/IEvent';
import User from './User';
import { Volunteer } from './Volunteer';
import { VolunteerGroup } from './VolunteerGroup';

/**
 * Represents the event this volunteer portal exists for, including data on all the volunteers,
 * events and sessions. Provides a number of utility functions for selecting data.
 */
class Event {
    private available: boolean = false;

    /**
     * Mapping from a group's token to an object detailing its details.
     */
    private volunteerGroups: Map<string, VolunteerGroup> = new Map();

    /**
     * Mapping from a user's token to an object detailing its details.
     */
    private volunteers: Map<string, Volunteer> = new Map();

    /**
     * The Volunteer instance for the logged in user, providing quick and easy access. Not all
     * logged in users have a Volunteer object, as the latter indicates they have a schedule too.
     */
    private volunteer?: Volunteer;

    /**
     * Asynchronously loads the event using the EventLoader. The |user| instance will be used to
     * obtain their authentication token, and to sign them out in case their data expired.
     */
    async load(user: User): Promise<void> {
        const eventLoader = new EventLoader();

        // Wait until loading has been completed. If loading failed due to a user error, sign them
        // out of their account forcing them back to the login screen.
        if (!await eventLoader.load(user.authToken)) {
            if (eventLoader.isUserError())
                user.logout();

            return;
        }

        const eventData = eventLoader.eventData;

        // While we've verified the format of the |eventData|, there can still be a slew of other
        // issues with it, particularly invalid cross-references.
        try {
            for (const info of eventData.volunteerGroups)
                this.volunteerGroups.set(info.groupToken, new VolunteerGroup(info));

            for (const info of eventData.volunteers) {
                const volunteerGroup = this.volunteerGroups.get(info.groupToken);
                if (!volunteerGroup)
                    throw new Error('Invalid volunteer group for user ' + info.userToken);

                this.volunteers.set(info.userToken, new Volunteer(info, volunteerGroup));
            }

            this.volunteer = this.volunteers.get(user.userToken);

        } catch (e) {
            console.error('Unable to import the event data.', e);
            return;
        }

        this.available = true;
    }

    /**
     * Returns whether all event information is fully available.
     */
    isAvailable(): boolean {
        return this.available;
    }

    /**
     * Returns an iterator that provides access over the groups of volunteers.
     */
    getVolunteerGroups(): IterableIterator<VolunteerGroup> {
        return this.volunteerGroups.values();
    }
}

export default Event;
