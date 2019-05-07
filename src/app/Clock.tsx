// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

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
    offset?: number;

    /**
     * Loads the configured time difference, if any, from local storage.
     */
    constructor() {
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
     * Returns the current time in Moment representation. It will have been adjusted for any local
     * modifications that have been made to the time.
     *
     * @see https://momentjs.com/docs/
     */
    getMoment(): moment.Moment {
        if (this.offset !== undefined)
            return moment().add(this.offset);

        return moment();
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
    }
}

export default Clock;
