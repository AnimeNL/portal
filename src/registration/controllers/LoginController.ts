// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import EmailValidator from 'email-validator';

import { ILoginController, LoginResult } from './LoginControllerContext';

/**
 * Implementation of the login controller. Made available to 
 */
export class LoginController implements ILoginController {
    /**
     * Requests a login for the given |accessCode| and |emailAddress|. Both are expected to validate
     * per the portal's requirements. Asynchronously returns a LoginResult.
     */
    async requestLogin(accessCode: string, emailAddress: string): Promise<LoginResult> {
        await new Promise(resolve => setTimeout(resolve, 3000));

        return { result: false, message: 'NOT IMPLEMENTED' };
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
