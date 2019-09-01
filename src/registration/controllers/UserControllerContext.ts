// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

/**
 * Possible outcomes of a login request. Contains the result as a boolean, and a message that can
 * be displayed to the user in case of a failure.
 */
export type LoginResult = { result: boolean, message?: string };

/**
 * Interface that a UserControllerContext has to support.
 */
export interface IUserController {
    /**
     * Requests a login for the given |accessCode| and |emailAddress|. Both are expected to validate
     * per the portal's requirements. Asynchronously returns a LoginResult.
     */
    requestLogin(accessCode: string, emailAddress: string): Promise<LoginResult>;

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
    validateAccessCode: (value: string) => false,
    validateEmailAddress: (value: string) => false,
});
