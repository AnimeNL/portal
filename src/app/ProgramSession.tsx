// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

import Clock from './Clock';
import { IProgramSession } from './api/IProgramSession';
import { Location } from './Location';
import { ProgramEvent } from './ProgramEvent';

/**
 * Represents a session of a particular event.
 */
export class ProgramSession {
    info: IProgramSession;
    beginTime_: moment.Moment;
    endTime_: moment.Moment;

    event_: ProgramEvent;
    location_: Location;

    constructor(info: IProgramSession, event: ProgramEvent, location: Location, clock: Clock) {
        this.info = info;

        this.beginTime_ = clock.getMomentFromUnixTimestamp(info.beginTime);
        this.endTime_ = clock.getMomentFromUnixTimestamp(info.endTime);

        this.event_ = event;
        this.location_ = location;
        this.location_.addSession(this);
    }

    /**
     * Name of the event.
     */
    get name(): string {
        return this.info.name;
    }

    /**
     * Description of the event. Optional.
     */
    get description(): string | null {
        return this.info.description;
    }

    /**
     * The event of the session.
     */
    get event(): ProgramEvent {
        return this.event_;
    }

    /**
     * The location in which the session will be taking place.
     */
    get location(): Location {
        return this.location_;
    }

    /**
     * Time, in seconds since the UNIX epoch, at which session begins.
     */
    get beginTime(): moment.Moment {
        return this.beginTime_;
    }

    /**
     * Time, in seconds since the UNIX epoch, at which session ends.
     */
    get endTime(): moment.Moment {
        return this.endTime_;
    }
}
