// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import { IRegistrationRequest } from '../../api/IRegistration';

/**
 * Possible outcomes of a login request. Contains the result as a boolean, and a message that can
 * be displayed to the user in case of a failure.
 */
export type LoginDetails = { result: boolean, message?: string };
export type RegistrationResult = { result: boolean, accessCode?: string; message?: string };

/**
 * Interface that a UserControllerContext has to support.
 */
export interface IUserController {
    /**
     * Requests a login for the given |accessCode| and |emailAddress|. Both are expected to validate
     * per the portal's requirements. Asynchronously returns a LoginDetails.
     */
    requestLogin(accessCode: string, emailAddress: string): Promise<LoginDetails>;

    /**
     * Requests an account to be created for the given |request|. All fields are expected to have
     * been validated already. Asynchronously returns a RegistrationResult.
     */
    requestRegistration(request: IRegistrationRequest): Promise<RegistrationResult>;

    /**
     * Whether the given |value| is a valid access code for the portal. 
     */
    validateAccessCode(value: string): boolean;

    /**
     * Whether the given |value| is a valid e-mail address for the portal.
     */
    validateEmailAddress(value: string): boolean;
}

/**
 * The UserControllerContext. Provides the necessary values for a default implementation that
 * rejects all inputs.
 */
export const UserControllerContext = React.createContext<IUserController>({
    requestLogin: async (accessCode: string, emailAddress: string) => ({ result: false }),
    requestRegistration: async (request: IRegistrationRequest) => ({ result: false }),
    validateAccessCode: (value: string) => false,
    validateEmailAddress: (value: string) => false,
});
