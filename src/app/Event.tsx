// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import EventLoader from './EventLoader';
import { Floor } from './Floor';
import { Location } from './Location';
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
     * Mapping from a floor identifier to an object detailing it.
     */
    private floors: Map<number, Floor> = new Map();

    /**
     * Mapping from a location identifier to an object detailing it.
     */
    private locations: Map<number, Location> = new Map();

    /**
     * Mapping from a group's token to an object detailing it.
     */
    private volunteerGroups: Map<string, VolunteerGroup> = new Map();

    /**
     * Mapping from a user's token to an object detailing it.
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
            for (const info of eventData.floors)
                this.floors.set(info.id, new Floor(info));

            for (const info of eventData.locations) {
                const floor = this.floors.get(info.floorId);
                if (!floor)
                    throw new Error('Invalid floor for location: ' + info.id);

                this.locations.set(info.id, new Location(info, floor));
            }

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
     * Returns the volunteer that's currently logged in to the volunteer portal, if any.
     */
    getCurrentVolunteer(): Volunteer | undefined {
        return this.volunteer;
    }

    /**
     * Returns an iterator that provides access to all floors.
     */
    getFloors(): IterableIterator<Floor> {
        return this.floors.values();
    }

    /**
     * Returns an iterator that provides access to all volunteers.
     */
    getVolunteers(): IterableIterator<Volunteer> {
        return this.volunteers.values();
    }

    /**
     * Returns an iterator that provides access over the groups of volunteers.
     */
    getVolunteerGroups(): IterableIterator<VolunteerGroup> {
        return this.volunteerGroups.values();
    }

    /**
     * Returns an iterator that provides access over the volunteers belonging to a particular group.
     * The complexity of this operation is O(n) on the number of volunteers.
     *
     * @param group The group for which volunteers should be returned.
     * @return An iterator that provides access to all the volunteers in that particular group.
     */
    *getVolunteersForGroup(group: VolunteerGroup): IterableIterator<Volunteer> {
        for (const volunteer of this.volunteers.values()) {
            if (volunteer.group !== group)
                continue;

            yield volunteer;
        }
    }
}

export default Event;
