// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import Clock from './Clock';
import { UserLoginPath, mockableFetch } from '../config';
import { isBoolean, isNumber, isString } from './util/Validators';

/**
 * Key in the local storage under which the serialized login data will be stored.
 */
const kLoginDataKey = 'login-data';

/**
 * Interface describing the login data describing the user's current state. Generally fetched from
 * the Login API from the network on authentication, or deserialized from local storage on repeat
 * visits.
 *
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apilogin
 */
interface LoginData {
    userToken: string;
    authToken: string;
    expirationTime: number;
    enableDebug: boolean;
}

/**
 * Represents the user logged in to the application, if any. Contains logic to authenticate the user
 * based on given login details, as well as logic for signing out a user.
 */
class User {
    data?: LoginData;

    /**
     * The clock through which the current time can be obtained.
     */
    clock: Clock;

    constructor(clock: Clock) {
        this.clock = clock;
    }

    /**
     * Initializes the user's login state based on local storage. The data will be verified on load,
     * and `this.data` will only be initialized when successful.
     *
     * When invalid or expired login data is found in the local storage, this will be removed and
     * the page will be refreshed, effectively mimicing a logout.
     */
    initializeFromLocalStorage(): void {
        if (!navigator.cookieEnabled) {
            console.error('Cookies are disabled: the ability to log in is not available.');
            return;
        }

        const serializedData = localStorage.getItem(kLoginDataKey);
        if (!serializedData)
            return;

        try {
            const data = JSON.parse(serializedData);
            if (!data)
                return;

            // The |data| must be stored as a valid LoginData serialization. Any other value will
            // be considered garbage and will be ignored.
            if (!this.validateConfiguration(data))
                return;

            // If the expiration time has passed, the data should be disregarded.
            if (data.expirationTime < this.clock.getCurrentTimeMs())
                return;

            this.data = data;

        } catch (e) {
            console.error('Unable to parse the stored login data.', e);
        } finally {
            if (!this.data) {
                localStorage.removeItem(kLoginDataKey);
                window.location.reload();
            }
        }
    }

    /**
     * Stores a serialized version of |this.data| to local storage. This operation may fail if local
     * storage is not available, as is the case in Safari's private mode.
     */
    private storeToLocalStorage() {
        if (!navigator.cookieEnabled) {
            console.error('Cookies are disabled: the ability to log in is not available.');
            return;
        }

        try {
            localStorage.setItem(kLoginDataKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Unable to store the login data.', e);
        }
    }

    /**
     * Returns whether the user has been identified. This is a prerequisite for being able to access
     * the individual getters on this instance of User.
     */
    isIdentified(): boolean {
        return !!this.data;
    }

    /**
     * Title to use for senior volunteers, who can provide assistance.
     */
    get userToken(): string {
        if (!this.data) throw new Error('The user is not identified.');
        return this.data.userToken;
    }

    /**
     * Title to use for senior volunteers, who can provide assistance.
     */
    get authToken(): string {
        if (!this.data) throw new Error('The user is not identified.');
        return this.data.authToken;
    }

    /**
     * Setting on whether debug mode should be enabled for this user.
     */
    get enableDebug(): boolean {
        if (!this.data) throw new Error('The user is not identified.');
        return this.data.enableDebug;
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

            // Verify that the login attempt was successful. If |data.success| was not defined, this
            // will result in a falsy value and thus count as a failed attempt.
            if (!data.success)
                return false;

            // Validate that the received |data| contains a full LoginData object.
            if (!this.validateConfiguration(data))
                return false;

            this.data = data;
            this.storeToLocalStorage();

            return true;

        } catch (e) {
            console.error('Unable to handle the login request.', e);
        }

        return false;
    }

    /**
     * Logs the user out of their account. All locally stored authentication data will be removed
     * and the state of the User class will return to that of an anonymous user.
     */
    logout(): void {
        if (!navigator.cookieEnabled) {
            console.error('Cookies are disabled: the ability to log out is not available.');
            return;
        }

        try {
            localStorage.removeItem(kLoginDataKey);
        } catch (e) {
            console.error('Unable to remove the login data.', e);
        }
    }

    /**
     * Validates that the given |data| conforms to the definition of LoginData.
     *
     * @param data The data as fetched from the network.
     */
    private validateConfiguration(data: any): data is LoginData {
        if (!isString(data.userToken)) {
            console.error('Unable to validate EnvironmentData.userToken.');
            return false;
        }

        if (!isString(data.authToken)) {
            console.error('Unable to validate EnvironmentData.authToken.');
            return false;
        }

        if (!isNumber(data.expirationTime)) {
            console.error('Unable to validate EnvironmentData.expirationTime.');
            return false;
        }

        if (!isBoolean(data.enableDebug)) {
            console.error('Unable to validate EnvironmentData.enableDebug.');
            return false;
        }

        return true;
    }
}

export default User;
