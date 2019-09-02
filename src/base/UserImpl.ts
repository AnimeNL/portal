// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ILoginRequest, ILoginResponse } from '../api/ILogin';

import { Configuration } from './Configuration';
import { User } from './User';
import { UserAbility } from './UserAbility';
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

    private userToken?: string;
    private authToken?: string;
    private expirationTime?: number;
    private abilities: Set<UserAbility>;

    constructor(configuration: Configuration) {
        this.configuration = configuration;

        // Initialize the |abilities| for the current user with the default ones.
        this.abilities = new Set(kDefaultAbilities);
    }

    /**
     * Initializes the User class with all associated state.
     */
    async initialize(): Promise<boolean> {
        // TODO: Handle initialization.
        return true;
    }

    getAuthToken(): string {
        if (!this.authToken)
            throw new Error(kExceptionMessage);

        return this.authToken;
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
    async login(request: ILoginRequest): Promise<boolean> {
        const kErrorPrefix = 'Unable to fetch the login response: ';

        try {
            const requestBody = new FormData();
            requestBody.append('email', request.email);
            requestBody.append('accessCode', request.accessCode);

            const result = await fetch(this.configuration.getLoginEndpoint(), {
                method: 'POST',
                body: requestBody,
            });

            if (!result.ok) {
                console.error(kErrorPrefix + ` status ${result.status}`);
                return false;
            }
            
            if (!this.initializeFromUnverifiedSource(kErrorPrefix, await result.text()))
                return false;
            
            // TODO: Cache in local storage.

            return true;

        } catch (exception) {
            console.error(kErrorPrefix, exception);
        }

        return false;
    }

    /**
     * Initializes the |unverifiedInput| as a ILoginResponse object. It's required to be JSON. Will
     * mutate local class state when successful.
     */
    initializeFromUnverifiedSource(errorPrefix: string, unverifiedInput: string): boolean {
        try {
            const unverifiedResponse = JSON.parse(unverifiedInput);
            if (!this.validateLoginResponse(unverifiedResponse))
                return false;

            this.userToken = unverifiedResponse.userToken;
            this.authToken = unverifiedResponse.authToken;
            this.expirationTime = unverifiedResponse.expirationTime;

            // Load all the abilities. Unknown abilities will be silently ignored.
            unverifiedResponse.abilities.forEach(ability => {
                const userAbility = kAbilitiesMap.get(ability);
                if (userAbility !== undefined)
                    this.abilities.add(userAbility);
            });

            return true;

        } catch (exception) {
            console.error(errorPrefix, exception);
        }

        return false;
    }

    /**
     * Validates the |unverifiedResponse| as a ILoginResponse object according to the API.
     */
    validateLoginResponse(unverifiedResponse: any): unverifiedResponse is ILoginResponse {
        const kInterfaceName = 'ILoginResponse';

        if (!validateBoolean(unverifiedResponse, kInterfaceName, 'success') ||
            !unverifiedResponse.success) {
            return false;
        }

        return validateString(unverifiedResponse, kInterfaceName, 'userToken') &&
               validateString(unverifiedResponse, kInterfaceName, 'authToken') &&
               validateNumber(unverifiedResponse, kInterfaceName, 'expirationTime') &&
               validateArray(unverifiedResponse, kInterfaceName, 'abilities');
    }
}
