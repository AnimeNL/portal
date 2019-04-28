// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

/**
 * Represents a clock and enables code to retrieve the current time.
 *
 * TODO: Enable the portal's time to be artificially changed for debugging purposes.
 * TODO: Enable the portal's time to be simulated and forwarded for testing purposes.
 */
class Clock {
    /**
     * Returns the current time in Moment representation. It will have been adjusted for any local
     * modifications that have been made to the time.
     *
     * @see https://momentjs.com/docs/
     */
    getMoment(): moment.Moment {
        return moment();
    }

    /**
     * Returns the current time in milliseconds.
     */
    getCurrentTimeMs(): number {
        return Date.now();
    }
}

export default Clock;
