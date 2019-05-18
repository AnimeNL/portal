// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment-timezone/moment-timezone';

import { timezoneData } from './util/timezoneData';

type ObserverFn = (time: moment.Moment) => void;

/**
 * Key, used in local storage, where the time offset will be stored.
 */
const kTimeOffsetKey: string = 'time_offset_dev';

/**
 * The minimum and maximum difference that may be stored. These should notimpose any functional
 * limitations, but purely safeguard to make sure we don't end up in completely crazy situations.
 */
const kMaximumDifferenceMs: number = 5 * 365 * 24 * 60 * 60 * 1000;  // 5 years

/**
 * Represents a clock and enables code to retrieve the current time.
 *
 * TODO: Enable the portal's time to be simulated and forwarded for testing purposes.
 */
class Clock {
    observers: Set<ObserverFn>;
    offset?: number;
    timezone?: string;

    /**
     * Loads the configured time difference, if any, from local storage.
     */
    constructor() {
        this.observers = new Set();

        // Import the timezone data to moment-timezone.
        moment.tz.load(timezoneData);

        try {
            const differenceString = localStorage.getItem(kTimeOffsetKey);
            if (differenceString !== null) {
                const difference = parseInt(differenceString, 10);
                if (difference >= -kMaximumDifferenceMs && difference <= kMaximumDifferenceMs)
                    this.offset = difference;
            }
        } catch (e) {}
    }

    /**
     * Sets the timezone in which the event will be taking place. This must be one of the zone
     * indicators supported by momentJS timezone. The timezone must be set before using `getMoment`.
     *
     * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
     */
    setTimezone(timezone: string): void {
        this.timezone = timezone;
    }

    /**
     * Returns the time in Moment representation. It will have been adjusted for any local
     * modifications that have been made to the time, as well as for the timezone of the event.
     *
     * @param input Input to the `moment()` constructor. Timestamps should be in UTC. Optional.
     * @see https://momentjs.com/docs/
     */
    getMoment(input?: moment.MomentInput): moment.Moment {
        if (!this.timezone)
            throw new Error('The timezone must be set before obtaining a moment.');

        if (this.offset !== undefined)
            return moment.tz(input, this.timezone).add(this.offset);

        return moment.tz(input, this.timezone);
    }

    /**
     * Returns a Moment instance for the given |timestamp|, which is expected to be a UNIX
     * timestamp in UTC. The Moment will be set to the appropriate timezone.
     *
     * @param timestamp The timestamp that should be converted to a Moment instance.
     */
    getMomentFromUnixTimestamp(timestamp: number): moment.Moment {
        if (!this.timezone)
            throw new Error('The timezone must be set before obtaining a moment.');

        return moment.unix(timestamp).utc().tz(this.timezone);
    }

    /**
     * Adds the |observer| to be invoked when the time changes.
     */
    addObserver(observer: ObserverFn): void {
        this.observers.add(observer);
    }

    /**
     * Deletes the |observer| from the list of things to invoke when the time changes.
     */
    removeObserver(observer: ObserverFn): void {
        this.observers.delete(observer);
    }

    /**
     * Called when the current time should be adjusted based on a request made on the Internals
     * page. This will take place application-wide.
     *
     * @param time The new time that should be re-instated.
     */
    setMomentFromInternals(time: moment.Moment) {
        const difference = time.diff(moment());

        // (1) Store the |difference| for the local application state.
        this.offset = difference;

        // (2) Store the |difference| for future application states.
        try {
            localStorage.setItem(kTimeOffsetKey, difference.toString());
        } catch (e) {
            console.error('Could not store the time difference in local storage.', e);
        }

        // (3) Announce the time update to the listening observers.
        for (const observer of this.observers)
            observer(this.getMoment());
    }
}

export default Clock;
