// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import EventLoader from './EventLoader';
import Clock from './Clock';
import { Floor } from './Floor';
import { Location } from './Location';
import { ProgramEvent } from './ProgramEvent';
import { ProgramSession } from './ProgramSession';
import { Shift } from './Shift';
import User from './User';
import { Volunteer } from './Volunteer';
import { VolunteerGroup } from './VolunteerGroup';
import { VolunteerTracker } from './VolunteerTracker';

/**
 * Interface describing a volunteer, as well as their current and upcoming activities.
 */
export interface VolunteerActivityInfo {
    /**
     * The volunteer this structure is defining.
     */
    volunteer: Volunteer;

    /**
     * The shift this volunteer is currently engaged in, if any.
     */
    currentShift?: Shift;

    /**
     * The next shift this volunteer will engage in, if any.
     */
    upcomingShift?: Shift;
}

/**
 * Interface representing the activity status for a group of volunteers.
 */
interface VolunteerGroupActivityInfo {
    /**
     * The group of volunteers this information is about.
     */
    group: VolunteerGroup;

    /**
     * The number of shifts within this group that are currently active.
     */
    activeShifts: number;
}

/**
 * Represents the event this volunteer portal exists for, including data on all the volunteers,
 * events and sessions. Provides a number of utility functions for selecting data.
 */
class Event {
    private available: boolean = false;

    /**
     * Mapping from an event Id to an object detailing it.
     */
    private events: Map<number, ProgramEvent> = new Map();

    /**
     * Mapping from a floor identifier to an object detailing it.
     */
    private floors: Map<number, Floor> = new Map();

    /**
     * Object of string => string pairs with notes that should be displayed on the Internals page.
     */
    private internalNotes: { [key: string]: string } = {};

    /**
     * Mapping from a location identifier to an object detailing it.
     */
    private locations: Map<number, Location> = new Map();

    /**
     * Version of the event that has been loaded, if any.
     */
    public version?: string;

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
     * The volunteer tracker that keeps track of our volunteers' activities.
     */
    private volunteerTracker?: VolunteerTracker;

    /**
     * Asynchronously loads the event using the EventLoader. The |user| instance will be used to
     * obtain their authentication token, and to sign them out in case their data expired.
     */
    async load(user: User, clock: Clock): Promise<void> {
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

            for (const info of eventData.events) {
                const sessions : ProgramSession[] = [];
                const event = new ProgramEvent(info, sessions);

                for (const sessionInfo of info.sessions) {
                    const location = this.locations.get(sessionInfo.locationId);
                    if (!location)
                        throw new Error('Invalid location for session: ' + info.id);

                    sessions.push(new ProgramSession(sessionInfo, event, location, clock));
                }

                this.events.set(info.id, event);
            }

            this.version = eventData.version;

            for (const info of eventData.volunteerGroups)
                this.volunteerGroups.set(info.groupToken, new VolunteerGroup(info));

            for (const info of eventData.volunteers) {
                const volunteerGroup = this.volunteerGroups.get(info.groupToken);
                if (!volunteerGroup)
                    throw new Error('Invalid volunteer group for user ' + info.userToken);

                this.volunteers.set(info.userToken, new Volunteer(info, volunteerGroup));
            }

            for (const info of eventData.shifts) {
                const volunteer = this.volunteers.get(info.userToken);
                const event = info.eventId !== null ? this.events.get(info.eventId) : undefined;

                if (!volunteer)
                    throw new Error('Invalid volunteer for shift.');

                // The Shift instance will automatically "register" itself with the given
                // |volunteer| and |event|, through which it will be accessible.
                new Shift(info, volunteer, event, clock);
            }

            this.volunteerTracker = new VolunteerTracker(this.volunteers);
            this.volunteer = this.volunteers.get(user.userToken);

            if (eventData.internalNotes)
                this.internalNotes = eventData.internalNotes;

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
     * Returns the event identified by the given |id|, if any.
     */
    getEvent(id: number): ProgramEvent | undefined {
        return this.events.get(id);
    }

    /**
     * Returns an iterator that provides access to all events.
     */
    getEvents(): IterableIterator<ProgramEvent> {
        return this.events.values();
    }

    /**
     * Returns the floor identified by the given |id|, if any.
     */
    getFloor(id: number): Floor | undefined {
        return this.floors.get(id);
    }

    /**
     * Returns an iterator that provides access to all floors.
     */
    getFloors(): IterableIterator<Floor> {
        return this.floors.values();
    }

    /**
     * Returns an object with notes to display on the Internals page.
     */
    getInternalNotes(): { [key: string]: string } {
        return this.internalNotes;
    }

    /**
     * Returns the location identified by the given |id|, if any.
     */
    getLocation(id: number): Location | undefined {
        return this.locations.get(id);
    }

    /**
     * Returns an iterator that provides access to all locations.
     */
    getLocations(): IterableIterator<Location> {
        return this.locations.values();
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
    getVolunteerGroups(): VolunteerGroupActivityInfo[] {
        if (!this.volunteerTracker)
            throw new Error('The volunteer tracker must be initialized for this method to work.');

        let groups: VolunteerGroupActivityInfo[] = [];

        for (const volunteerGroup of this.volunteerGroups.values()) {
            groups.push({
                group: volunteerGroup,
                activeShifts: this.volunteerTracker.getActiveShiftsForGroup(volunteerGroup),
            })
        }

        return groups;
    }

    /**
     * Returns an iterator that provides access over the volunteers belonging to a particular group.
     * The complexity of this operation is O(n) on the number of volunteers.
     *
     * @param group The group for which volunteers should be returned.
     * @return An iterator that provides access to all the volunteers in that particular group.
     */
    *getVolunteersForGroup(group: VolunteerGroup): IterableIterator<VolunteerActivityInfo> {
        if (!this.volunteerTracker)
            throw new Error('The volunteer tracker must be initialized for this method to work.');

        for (const volunteer of this.volunteers.values()) {
            if (volunteer.group !== group)
                continue;

            yield {
                ...this.volunteerTracker.getActivityInfoForVolunteer(volunteer),
                volunteer,
            };
        }
    }
}

export default Event;
