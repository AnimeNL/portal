// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IVolunteerGroup } from './IVolunteerGroup';
import { IVolunteerInfo } from './IVolunteerInfo';

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apievent
 */
export interface IEvent {
    success: boolean;
    volunteerGroups: IVolunteerGroup[];
    volunteers: IVolunteerInfo[];
}
