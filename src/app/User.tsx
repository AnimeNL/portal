// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { UserLoginPath, mockableFetch } from '../config';

/**
 * Interface describing the login data describing the user's current state. Generally fetched from
 * the Login API from the network on authentication, or deserialized from local storage on repeat
 * visits.
 *
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apilogin
 */
interface LoginData {
    // TODO: Define the fields
}


/**
 * Represents the user logged in to the application, if any. Contains logic to authenticate the user
 * based on given login details, as well as logic for signing out a user.
 */
class User {
    data?: LoginData;

    /**
     * Initializes the user's login state based on local storage. The data will be verified on load,
     * and `this.data` will only be initialized when successful.
     */
    initialize(): void {

    }

    /**
     * Returns whether the user has been identified. This is a prerequisite for being able to access
     * the individual getters on this instance of User.
     */
    isIdentified(): boolean {
        return !!this.data;
    }

    /**
     * Attempt to log in the user identified by the given |email| address with the given
     * |accessCode|. This will require internet connectivity.
     *
     * @param email The e-mail address for which the login has been requested.
     * @param accessCode The access code associated with the given e-mail address.
     * @return Whether the login attempt was successful. Asynchronous.
     */
    async login(email: string, accessCode: string): Promise<boolean> {
        try {
            const requestBody = new FormData();
            requestBody.append('email', email);
            requestBody.append('accessCode', accessCode);

            const response = await mockableFetch(UserLoginPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: requestBody
            });

            if (!response.ok) {
                console.error('Unable to fulfil the login request.')
                return false;
            }

            const data = JSON.parse(await response.text());
            if (!data) {
                console.error('Unable to parse the login response.');
                return false;
            }

            this.data = data;

        } catch (e) {
            console.error('Unable to handle the login request.', e);
        }

        return false;
    }

    /**
     * Validates that the given |data| conforms to the definition of LoginData.
     *
     * @param data The data as fetched from the network.
     */
    private validateConfiguration(data: any): data is LoginData {
        return true;
    }
}

export default User;
