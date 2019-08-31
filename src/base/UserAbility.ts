// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * User abilities define what a visitor is able to do on the volunteer portal. Some may be available
 * to everyone, while others can only be assigned by the server.
 * 
 * When adding a new ability, make sure to update //base/User.ts to parse it from the server.
 */
export enum UserAbility {
    /**
     * Access to particular applications part of this portal.
     */
    RegistrationApplication,
    ScheduleApplication,
}
