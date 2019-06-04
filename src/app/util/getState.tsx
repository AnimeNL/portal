// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

import { ProgramSession } from '../ProgramSession';
import { Shift } from '../Shift';

type State = 'past' | 'active' | 'pending';

/**
 * Returns whether the session or shift is in the past, active or in the future.
 */
export function getState(currentTime: moment.Moment, input: ProgramSession | Shift): State {
    if (input.endTime < currentTime)
        return 'past';

    if (input.beginTime < currentTime)
        return 'active';

    return 'pending';
}
