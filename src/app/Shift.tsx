// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

import Clock from './Clock';
import { IShift } from './api/IShift';
import { ProgramEvent } from './ProgramEvent';
import { Volunteer } from './Volunteer';

/**
 * Type of shift the instance represents.
 */
enum Type {
    Available,
    Unavailable,
    Event
}

/**
 * Represents a shift for a volunteer at a particular event. Also used to indicate availability or
 * unavailability of the volunteer.
 */
export class Shift {
    type_: Type;

    volunteer_: Volunteer;
    event_?: ProgramEvent;

    beginTime_: moment.Moment;
    endTime_: moment.Moment;

    constructor(info: IShift, volunteer: Volunteer, event: ProgramEvent | undefined, clock: Clock) {
        this.type_ = Type.Unavailable;  // make TypeScript happy
        this.volunteer_ = volunteer;

        switch (info.type) {
            case "available":
                this.type_ = Type.Available;
                break;

            case "unavailable":
                this.type_ = Type.Unavailable;
                break;

            case "event":
                this.type_ = Type.Event;
                this.event_ = event;
                break;
        }

        this.beginTime_ = clock.getMomentFromUnixTimestamp(info.beginTime);
        this.endTime_ = clock.getMomentFromUnixTimestamp(info.endTime);

        if (this.event_)
            this.event_.addShift(this);

        this.volunteer_.addShift(this);
    }

    /**
     * Gets the volunteer who will be working this shift.
     */
    get volunteer(): Volunteer {
        return this.volunteer_;
    }

    /**
     * Gets the event at which this shift will take place, if any. Only applicable for shifts that
     * have their |type| set to Event.
     */
    get event(): ProgramEvent {
        if (!this.event_)
            throw new Error('Unable to access the event when there is none available.');

        return this.event_;
    }

    /**
     * Returns whether the volunteer is available during this time.
     */
    isAvailable(): boolean {
        return this.type_ === Type.Available;
    }

    /**
     * Returns whether the volunteer is unavailable during this time.
     */
    isUnavailable(): boolean {
        return this.type_ === Type.Unavailable;
    }

    /**
     * Returns whether this shift has an associated event.
     */
    isEvent(): boolean {
        return this.type_ === Type.Event;
    }

    /**
     * Gets the time at which this shift will begin.
     */
    get beginTime(): moment.Moment {
        return this.beginTime_;
    }

    /**
     * Gets the time at which this shift will finish.
     */
    get endTime(): moment.Moment {
        return this.endTime_;
    }
}
