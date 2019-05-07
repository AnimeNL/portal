// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

import { IProgramSession } from './api/IProgramSession';
import { Location } from './Location';

/**
 * Represents a session of a particular event.
 */
export class ProgramSession {
    info: IProgramSession;
    beginTime_: moment.Moment;
    endTime_: moment.Moment;

    location_: Location;

    constructor(info: IProgramSession, location: Location) {
        this.info = info;

        this.beginTime_ = moment.unix(info.beginTime);
        this.endTime_ = moment.unix(info.endTime);

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
