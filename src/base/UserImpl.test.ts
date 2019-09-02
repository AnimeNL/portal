// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import 'jest-localstorage-mock';

import mockConsole from 'jest-mock-console';

import { ILoginRequest } from '../api/ILogin';

import { ConfigurationImpl } from './ConfigurationImpl';
import { UserImpl, kDefaultAbilities } from './UserImpl';

const mockServer = require('mockttp').getLocal({ cors: true });

/**
 * Semantically valid login request. We don't test the server, so ignore the contents.
 */
const kLoginRequest: ILoginRequest = {
    email: 'foo@bar.com',
    accessCode: '5678',
};

describe('UserImpl', () => {
    beforeEach(() => mockServer.start());
    afterEach(() => mockServer.stop() && sessionStorage.clear());

    /**
     * Creates an instance of the UserImpl object specifically to handle a login request. The
     * |status| and |response| objects can be used to influence the outcome.
     * 
     * @param status The HTTP status code the mock server should respond with.
     * @param response The response that should be returned by the mock server.
     */
    function createInstanceForLoginRequest(status: number, response: object): UserImpl {
        const configuration = new ConfigurationImpl();
        const endpoint = mockServer.url + '/api/login';

        configuration.setLoginEndpoint(endpoint);

        mockServer.post(endpoint).thenJson(status, response);

        return new UserImpl(configuration);
    }

    it('can assign certain abilities by default', () => {
        const configuration = new ConfigurationImpl();
        const user = new UserImpl(configuration);

        expect(user.hasAccount()).toBeFalsy();

        // While it is valid for there to be no default abilities, for the sake of verifying that
        // this test does something useful we'll assume there to be at least one.
        expect(kDefaultAbilities.length).toBeGreaterThan(0);

        kDefaultAbilities.forEach(ability =>
            expect(user.hasAbility(ability)).toBeTruthy());
    });

    it('should be able to process successful login requests', async () => {
        const user = createInstanceForLoginRequest(200, {
            success: true,
            userToken: 'abc',
            authToken: 'def',
            expirationTime: 9001,
            abilities: [],
        });

        const result = await user.login(kLoginRequest);
        expect(result).toBeTruthy();

        expect(user.getAuthToken()).toEqual('def');
        expect(user.getUserToken()).toEqual('abc');
    });

    it('should fail when processing an invalid login request', async () => {
        const restoreConsole = mockConsole();
        const user = createInstanceForLoginRequest(200, {
            success: false,
        });

        const result = await user.login(kLoginRequest);
        expect(result).toBeFalsy();

        restoreConsole();
    });

    it('should fail when the login API endpoint is unavailable', async () => {
        const restoreConsole = mockConsole();
        const user = createInstanceForLoginRequest(404, {});

        const result = await user.login(kLoginRequest);
        expect(result).toBeFalsy();

        restoreConsole();
    });

    it('should fail when the login API endpoint returns invalid data', async () => {
        const restoreConsole = mockConsole();
        const user = createInstanceForLoginRequest(200, {
            success: true,
            missingProperties: true,
        });

        const result = await user.login(kLoginRequest);
        expect(result).toBeFalsy();

        restoreConsole();
    });

    it('should throw when accessing properties prematurely', () => {
        const configuration = new ConfigurationImpl();
        const user = new UserImpl(configuration);

        expect(user.hasAccount()).toBeFalsy();

        expect(() => user.getAuthToken()).toThrowError();
        expect(() => user.getUserToken()).toThrowError();
    });
});
