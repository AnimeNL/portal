// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apiregistration
 */
export interface IRegistrationRequest {
    firstName: string;
    lastName: string;
    emailAddress: string;
    telephoneNumber: string;
    dateOfBirth: string;  // YYYY-MM-DD
    fullAvailability: boolean;
    nightShifts: boolean;
    socialMedia: boolean;
    dataProcessing: boolean;
}

/**
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apiregistration
 */
export interface IRegistrationResponse {
    success: boolean;

    // Success responses:
    accessCode?: string;

    // Failure responses:
    message?: string;
}
