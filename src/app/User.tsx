// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

import { Ability } from '../abilities';
import { ILogin } from './api/ILogin';
import { ThemeDelegate, ThemeProvider } from '../theme';
import { UserLoginPath, kEnableDarkTheme, mockableFetch } from '../config';
import { isBoolean, isNumber, isString, validationError } from './util/Validators';

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
interface LoginData extends ILogin {
    // Optional fields maintained for internal application state. Can be set by the server to set
    // defaults, but not formally documented as an API.
    darkThemeEnabled?: boolean;
}

/**
 * Represents the user logged in to the application, if any. Contains logic to authenticate the user
 * based on given login details, as well as logic for signing out a user.
 */
class User implements ThemeDelegate {
    data?: LoginData;

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

            // If the expiration time has passed, the data should be disregarded. This deliberately
            // does not adhere to mocked time in the Clock.
            if (moment.unix(data.expirationTime) < moment())
                return;

            ThemeProvider.setDelegate(this);

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
     * Returns whether the user has the given |ability| activated for their account.
     */
    hasAbility(ability: Ability): boolean {
        if (!this.data) throw new Error('The user is not identified.');
        return this.data.abilities.includes(ability);
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
     * Returns whether dark theme is currently enabled.
     */
    isDarkThemeEnabled(): boolean {
        if (this.data && this.data.darkThemeEnabled !== undefined)
            return !!this.data.darkThemeEnabled;

        if (kEnableDarkTheme && window.matchMedia)
            return window.matchMedia('(prefers-color-scheme: dark)').matches;

        return false;
    }

    /**
     * Sets whether dark theme should be enabled.
     */
    setDarkThemeEnabled(enabled: boolean | undefined): void {
        if (this.data) {
            this.data.darkThemeEnabled = enabled;
            this.storeToLocalStorage();
        }
    }

    /**
     * Validates that the given |data| conforms to the definition of LoginData.
     *
     * @param data The data as fetched from the network.
     */
    private validateConfiguration(data: any): data is LoginData {
        const kInterface = 'LoginData';

        if (!isString(data.userToken)) {
            validationError(kInterface, 'userToken');
            return false;
        }

        if (!isString(data.authToken)) {
            validationError(kInterface, 'authToken');
            return false;
        }

        if (!isNumber(data.expirationTime)) {
            validationError(kInterface, 'expirationTime');
            return false;
        }

        if (!Array.isArray(data.abilities)) {
            validationError(kInterface, 'abilities');
            return false;
        }

        for (const ability of data.abilities) {
            if (!isString(ability)) {
                validationError(kInterface, 'abilities');
                return false;
            }
        }

        if ('darkThemeEnabled' in data && !isBoolean(data.darkThemeEnabled)) {
            validationError(kInterface, 'darkThemeEnabled');
            return false;
        }

        return true;
    }
}

export default User;
