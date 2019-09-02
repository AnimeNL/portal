// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apilogin
 */
export interface ILoginRequest {
    email: string;
    accessCode: string;
}

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apilogin
 */
export interface ILoginResponse {
    success: boolean;
    userName: string;
    userToken: string;
    authToken: string;
    expirationTime: number;
    abilities: string[];
}
