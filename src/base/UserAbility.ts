// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * User abilities define what a visitor is able to do on the volunteer portal. Some may be available
 * to everyone, while others can only be assigned by the server.
 * 
 * When adding a new ability, make sure to update //base/UserImpl.ts to parse it from the server.
 */
export enum UserAbility {
    /**
     * The `Root` ability is a special-cased ability, as it means that the user has all possible
     * abilities assigned to their account, even when not specifically listed.
     */
    Root,

    /**
     * The `Debug` ability gives access to debugging surfaces and internal application information
     * that's not relevant to most non-developing people.
     */
    Debug,

    /**
     * Access to particular applications part of this portal.
     */
    RegistrationApplication,
    ScheduleApplication,

    /**
     * Abilities specific to the ScheduleApplication.
     * 
     * - ManageEventInfo: Whether the description of events can be updated for everyone.
     * - UpdateAvatarAll: Whether the avatar editor should be available for all people.
     * - UpdateAvatarSelf: Whether the avatar editor should be available for the current user.
     */
    ManageEventInfo,
    UpdateAvatarAll,
    UpdateAvatarSelf,
}
