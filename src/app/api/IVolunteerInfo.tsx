// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#volunteerinfo-interface
 */
export interface IVolunteerInfo {
    userToken: string;
    groupToken: string;
    name: string;
    avatar: string | null;
    title: string;
    accessCode: string | null;
    telephone: string | null;
}
