// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#shift-interface
 */
export interface IShift {
    userToken: string;
    type: "available" | "unavailable" | "event";
    eventId: number | null;
    beginTime: number;
    endTime: number;
}
