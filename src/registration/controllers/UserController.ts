// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import EmailValidator from 'email-validator';

import { IRegistrationRequest, IRegistrationResponse } from '../../api/IRegistration';

import { Configuration } from '../../base/Configuration';
import { IUserController, LoginDetails, RegistrationResult } from './UserControllerContext';
import { LoginResult, User } from '../../base/User';
import { validateBoolean, validateString } from '../../base/TypeValidators';

/**
 * Implementation of the user controller. Made available to 
 */
export class UserController implements IUserController {
    private configuration: Configuration;
    private user: User;

    constructor(configuration: Configuration, user: User) {
        this.configuration = configuration;
        this.user = user;
    }

    /**
     * Requests a login for the given |accessCode| and |emailAddress|. Both are expected to validate
     * per the portal's requirements. Asynchronously returns a LoginResult.
     */
    async requestLogin(accessCode: string, emailAddress: string): Promise<LoginDetails> {
        const result = await this.user.login({ email: emailAddress, accessCode });

        switch (result) {
            case LoginResult.ErrorConnectionIssue:
                return { result: false, message: 'De server is onbereikbaar.' };
            case LoginResult.ErrorCookiesDisabled:
                return { result: false, message: 'Cookies zijn niet beschikbaar in je browser.' };
            case LoginResult.ErrorServerIssue:
                return { result: false, message: 'Er is een probleem met de server.' };
            case LoginResult.ErrorUserIssue:
                return { result: false, message: 'Je inloggegevens zijn niet bekend.' };
            case LoginResult.Success:
                return { result: true };
        }
    }

    /**
     * Requests an account to be created for the given |request|. All fields are expected to have
     * been validated already. Asynchronously returns a RegistrationResult.
     */
    async requestRegistration(request: IRegistrationRequest): Promise<RegistrationResult> {
        const kErrorPrefix = 'Unable to fetch the registration response: ';

        try {
            const requestBody = new FormData();

            // Move the full |request| over to the |requestBody| object.
            Object.entries(request).forEach(([key, value]) => requestBody.set(key, value));

            const result = await fetch(this.configuration.getRegistrationEndpoint(), {
                method: 'POST',
                body: requestBody,
            });

            if (!result.ok) {
                console.error(kErrorPrefix + ` status ${result.status}`);
                return { result: false, message: 'Er is een probleem met de server.' };
            }
            
            let unverifiedResponse: object | null = null;

            try {
                unverifiedResponse = JSON.parse(await result.text());
            } catch (exception) {
                console.error(kErrorPrefix, exception);
            }

            if (!unverifiedResponse || !this.validateRegistrationResponse(unverifiedResponse))
                return { result: false, message: 'Er is een probleem met de server.' };

            if (!unverifiedResponse.success)
                return { result: false, message: unverifiedResponse.message! };

            // Attempt to automatically log the user in to their account. This will open the fancy
            // registration state bar at the top of the application as an additional feedback. We
            // don't actually care about the result of the login.
            await this.user.login({ accessCode: unverifiedResponse.accessCode!,
                                    email: request.emailAddress });
            
            return {
                result: true,
                accessCode: unverifiedResponse.accessCode!
            };

        } catch (exception) {
            console.error(kErrorPrefix, exception);
        }

        return { result: false, message: 'De server is onbereikbaar.' };
    }

    /**
     * Validates that the |unverifiedResponse| is a valid IRegistrationResponse answer from the
     * server, in accordance with the API definition.
     * 
     * @see https://github.com/AnimeNL/portal/blob/master/API.md#apiregistration
     */
    validateRegistrationResponse(unverifiedResponse: any): unverifiedResponse is IRegistrationResponse {
        const kInterfaceName = 'IRegistrationResponse';

        if (!validateBoolean(unverifiedResponse, kInterfaceName, 'success'))
            return false;
        
        if (!unverifiedResponse.success)
            return validateString(unverifiedResponse, kInterfaceName, 'message');
        
        return validateString(unverifiedResponse, kInterfaceName, 'accessCode');
    }

    /**
     * Whether the given |value| is a valid access code for the portal. We require it to be a
     * numeric value that's between four and ten digits in length.
     */
    validateAccessCode(value: string): boolean {
        return /^\d{4,10}$/.test(value);
    }

    /**
     * Whether the given |value| is a valid e-mail address for the portal.
     */
    validateEmailAddress(value: string): boolean {
        return EmailValidator.validate(value);
    }
}
