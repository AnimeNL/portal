// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * An observer that will be informed of changes to the login state of the current user.
 */
export interface UserObserver {
    /**
     * Will be called when the user successfully logs in or logs out of their account.
     */
    onUserAccountStateChange(): void;
}
