// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

export function determineUpdateMoment(currentTime: moment.Moment,
                                      scheduleUpdate: moment.Moment): moment.Moment {
    return scheduleUpdate;
}
