// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IProgramSession } from './IProgramSession';

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#programevent-interface
 */
export interface IProgramEvent {
    id: number;
    internal: boolean;
    sessions: IProgramSession[];
}
