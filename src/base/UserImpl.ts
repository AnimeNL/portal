// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import moment from 'moment';

import { ILoginRequest, ILoginResponse } from '../api/ILogin';

import { Configuration } from './Configuration';
import { LoginResult, User } from './User';
import { UserAbility } from './UserAbility';
import { UserObserver } from './UserObserver';
import { validateArray, validateBoolean, validateNumber, validateString } from './TypeValidators';

/**
 * List of abilities that will be granted to each visitor.
 */
export const kDefaultAbilities: UserAbility[] = [
    UserAbility.RegistrationApplication,
];

/**
 * Map from the string representation to a UserAbility constant.
 */
const kAbilitiesMap = new Map<string, UserAbility>([
    ['debug',                       UserAbility.Debug],
    ['manage-event-info',           UserAbility.ManageEventInfo],
    ['registration-application',    UserAbility.RegistrationApplication],
    ['root',                        UserAbility.Root],
    ['schedule-application',        UserAbility.ScheduleApplication],
    ['update-avatar-all',           UserAbility.UpdateAvatarAll],
    ['update-avatar-self',          UserAbility.UpdateAvatarSelf],
]);

/**
 * Message to include with the exception thrown when data is being accessed before the UserImpl
 * has been initialized properly.
 */
const kExceptionMessage = 'The User object has not been successfully initialized yet.';

/**
 * Implementation of the User class, shared among all parts of the portal.
 */
export class UserImpl implements User {
    private configuration: Configuration;
    private observers: Set<UserObserver>;

    private userName?: string;
    private userToken?: string;
    private authToken?: string;
    private expirationTime?: number;
    private abilities: Set<UserAbility>;

    /**
     * Name of the session storage cache in which the login data will be recorded.
     */
    public static kCacheName: string = 'portal-login';

    constructor(configuration: Configuration) {
        this.configuration = configuration;
        this.observers = new Set();

        // Initialize the |abilities| for the current user with the default ones.
        this.abilities = new Set(kDefaultAbilities);
    }

    /**
     * Initializes the User class with all associated state. The login state will be read from
     * local storage if cookies are available (and data exists).
     */
    async initialize(): Promise<boolean> {
        if (navigator.cookieEnabled) {
            const kErrorPrefix = 'Unable to restore login state: ';
            const loginData = localStorage.getItem(UserImpl.kCacheName);

            // The user hasn't logged in at all if the cache does not exist.
            if (!loginData)
                return true;

            if (!this.initializeFromUnverifiedSource(kErrorPrefix, loginData)) {
                console.error('Removing login data from cache due to corruption.');
                this.logout();

                return true;
            }

            // TODO: This should be using an application-wide Clock implementation.
            if (this.expirationTime! < moment().unix()) {
                console.error('Removing login data from cache due to expiration.');
                this.logout();

                return true;
            }
        }

        return true;
    }

    getAuthToken(): string {
        if (!this.authToken)
            throw new Error(kExceptionMessage);

        return this.authToken;
    }
    
    getUserName(): string {
        if (!this.userName)
            throw new Error(kExceptionMessage);

        return this.userName;
    }

    getUserToken(): string {
        if (!this.userToken)
            throw new Error(kExceptionMessage);

        return this.userToken;
    }

    hasAbility(ability: UserAbility): boolean {
        return this.abilities.has(ability) || this.abilities.has(UserAbility.Root);
    }

    hasAccount(): boolean {
        return this.userToken !== undefined;
    }

    /**
     * Attempts to process the login |request|. A promise will be returned that indicates whether
     * the user successfully logged in to an account. If so, the User interface will self-update.
     */
    async login(request: ILoginRequest): Promise<LoginResult> {
        if (!navigator.cookieEnabled) {
            console.error('Unable to process the login request: cookies are disabled.');
            return LoginResult.ErrorCookiesDisabled;
        }

        const kErrorPrefix = 'Unable to fetch the login response: ';

        try {
            const requestBody = new FormData();

            // Move the full |request| over to the |requestBody| object.
            Object.entries(request).forEach(([key, value]) => requestBody.set(key, value));

            const result = await fetch(this.configuration.getLoginEndpoint(), {
                method: 'POST',
                body: requestBody,
            });

            if (!result.ok) {
                console.error(kErrorPrefix + ` status ${result.status}`);
                return LoginResult.ErrorServerIssue;
            }
            
            const resultText = await result.text();
            const resultCode = this.initializeFromUnverifiedSource(kErrorPrefix, resultText);

            if (resultCode !== LoginResult.Success)
                return resultCode;
            
            // Store the |resultText| in local storage, so that the user can continue to be logged
            // in across same-site navigations. The expiration time will continue to take effect.
            localStorage.setItem(UserImpl.kCacheName, resultText);

            // Let all observers know of a successful account state change.
            this.notifyAccountStateChange();

            return LoginResult.Success;

        } catch (exception) {
            console.error(kErrorPrefix, exception);
        }

        return LoginResult.ErrorConnectionIssue;
    }

    /**
     * Initializes the |unverifiedInput| as a ILoginResponse object. It's required to be JSON. Will
     * mutate local class state when successful.
     */
    initializeFromUnverifiedSource(errorPrefix: string, unverifiedInput: string): LoginResult {
        try {
            const unverifiedResponse = JSON.parse(unverifiedInput);
            if (!this.validateLoginResponse(unverifiedResponse))
                return LoginResult.ErrorServerIssue;

            if (!unverifiedResponse.success)
                return LoginResult.ErrorUserIssue;

            this.userName = unverifiedResponse.userName;
            this.userToken = unverifiedResponse.userToken;
            this.authToken = unverifiedResponse.authToken;
            this.expirationTime = unverifiedResponse.expirationTime;

            // Load all the abilities. Unknown abilities will be silently ignored.
            unverifiedResponse.abilities.forEach(ability => {
                const userAbility = kAbilitiesMap.get(ability);
                if (userAbility !== undefined)
                    this.abilities.add(userAbility);
            });

            return LoginResult.Success;

        } catch (exception) {
            console.error(errorPrefix, exception);
        }

        return LoginResult.ErrorServerIssue;
    }

    /**
     * Validates the |unverifiedResponse| as a ILoginResponse object according to the API.
     */
    validateLoginResponse(unverifiedResponse: any): unverifiedResponse is ILoginResponse {
        const kInterfaceName = 'ILoginResponse';

        if (!validateBoolean(unverifiedResponse, kInterfaceName, 'success'))
            return false;
        
        if (!unverifiedResponse.success)
            return true;

        return validateString(unverifiedResponse, kInterfaceName, 'userName') &&
               validateString(unverifiedResponse, kInterfaceName, 'userToken') &&
               validateString(unverifiedResponse, kInterfaceName, 'authToken') &&
               validateNumber(unverifiedResponse, kInterfaceName, 'expirationTime') &&
               validateArray(unverifiedResponse, kInterfaceName, 'abilities');
    }

    /**
     * Signs the user out of the account they're identified to, if any. This resets all internal
     * state, including cached values, back to their default value.
     */
    logout(): void {
        this.userName = undefined;
        this.userToken = undefined;
        this.authToken = undefined;
        this.expirationTime = undefined;
        this.abilities = new Set(kDefaultAbilities);

        if (navigator.cookieEnabled)
            localStorage.removeItem(UserImpl.kCacheName);

        this.notifyAccountStateChange();
    }

    /**
     * Enables the |observer| from being able to track user account state changes.
     */
    addObserver(observer: UserObserver): void {
        this.observers.add(observer);
    }

    /**
     * Notify observers of an account state change.
     */
    private notifyAccountStateChange(): void {
        for (const observer of this.observers)
            observer.onUserAccountStateChange();
    }

    /**
     * Removes the |observer| from being able to track user account state changes.
     */
    removeObserver(observer: UserObserver): void {
        this.observers.delete(observer);
    }
}
