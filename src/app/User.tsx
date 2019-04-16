// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

// Represents the user logged in to the application, if any. Contains logic to authenticate the user
// based on given login details, as well as logic for signing out a user.
class User {
    identified?: boolean;

    // Returns whether the user has been identified. Authentication state will be verified the first
    // time that this method is called, but will be cached afterwards.
    isIdentified(): boolean {
        return !!this.identified;
    }
}

export default User;
