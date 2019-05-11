// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

/**
 * Determines the Moment at which a state update has to occur based on the current time and the next
 * pending schedule update. This is non-trivial since various pages will display time-until counters
 * that update at predetermined times, and rounds based on half minutes rather than sensible units.
 *
 * @param currentTime Current time of the Volunteer Portal runtime.
 * @param scheduleUpdate Time at which the next schedule update will occur.
 * @see https://momentjs.com/docs/#/displaying/fromnow/
 */
export function determineUpdateMoment(currentTime: moment.Moment,
                                      scheduleUpdate: moment.Moment): moment.Moment {
    const diff = scheduleUpdate.diff(currentTime, 'seconds');
    const delay = determineUpdateSeconds(diff);

    // Deliberately run a second slow, to make sure visible updates will be ready to propagate.
    return moment(currentTime).add({ seconds: delay + 1 });
}

/**
 * Determines the number of seconds until the next visible update.
 *
 * @see determineUpdateMoment
 */
function determineUpdateSeconds(diff: number): number {
    // (1) If the difference is <= 30 seconds, use the |diff| (or 0, whichever is larger) as time of
    //     the next visible update.
    if (diff <= 30)
        return Math.max(0, diff);

    // (2) If the difference is <= 44 minutes, the first visible update will happen at X:30 minutes.
    //     This is the case because moment rounds the minutes, as seconds aren't displayed.
    if (diff <= 44 * 60)
        return (30 + diff) % 60 || 60;

    // (3) If the difference is <= 21 hours, the first visible update will happen either when the
    //     schedule reaches 44 minutes (unit turning point), or at X:30 for hourly changes.
    if (diff <= 21 * 60 * 60)
        return Math.min(diff - 44 * 60, (30 * 60 + diff) % 3600 || 3600);

    // (4) If the difference is <= 25 days, the first visible update will happen either when the
    //     schedule reaches 21 hours (unit turning point), or at noon for daily changes.
    if (diff <= 25 * 24 * 60 * 60)
        return Math.min(diff - 21 * 60 * 60, (12 * 60 * 60 + diff) % 86400 || 86400);

    // (5) For durations beyond 25 days, just update once per day.
    return 86400;
}
