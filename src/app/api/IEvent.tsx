// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IFloor } from './IFloor';
import { ILocation } from './ILocation';
import { IProgramEvent } from './IProgramEvent';
import { IVolunteerGroup } from './IVolunteerGroup';
import { IVolunteerInfo } from './IVolunteerInfo';

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apievent
 */
export interface IEvent {
    success: boolean;
    events: IProgramEvent[];
    floors: IFloor[];
    locations: ILocation[];
    volunteerGroups: IVolunteerGroup[];
    volunteers: IVolunteerInfo[];
}
