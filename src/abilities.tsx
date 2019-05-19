// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Type listing all valid abilities used by the application.
 */
export enum Ability {
    /**
     * Controls whether the user is able to enter debug mode, which adds a number of additional
     * visual elements (particularly timers) as well as the Internals page.
     */
    Debug = 'debug',

    /**
     * Controls whether the user is able to manage event information.
     */
    ManageEventInfo = 'manage-event-info',

    /**
     * Controls whether the user is able to update all avatars.
     */
    UpdateAvatarAll = 'update-avatar-all',

    /**
     * Controls whether the user is able to update their own avatar.
     */
    UpdateAvatarSelf = 'update-avatar-self',
}
