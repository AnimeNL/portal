// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import 'jest-localstorage-mock';

import mockConsole from 'jest-mock-console';

import { ILoginRequest } from '../api/ILogin';

import { ConfigurationImpl } from './ConfigurationImpl';
import { LoginResult } from './User';
import { UserAbility } from './UserAbility';
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
    afterEach(() => mockServer.stop() && localStorage.clear());

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

    it('can log in users based on the data cached in localStorage', async () => {
        const configuration = new ConfigurationImpl();
        const user = new UserImpl(configuration);

        expect(localStorage.getItem).toHaveBeenCalledTimes(0);
        expect(user.hasAbility(UserAbility.Debug)).toBeFalsy();
        expect(user.hasAccount()).toBeFalsy();

        localStorage.setItem(UserImpl.kCacheName, JSON.stringify({
            success: true,
            userName: 'John Doe',
            userToken: 'abc',
            authToken: 'def',
            expirationTime: Number.MAX_SAFE_INTEGER,
            abilities: ['debug'],
        }));

        expect(await user.initialize()).toBeTruthy();

        expect(user.hasAccount()).toBeTruthy();

        expect(user.getUserName()).toEqual('John Doe');
        expect(user.getAuthToken()).toEqual('def');
        expect(user.getUserToken()).toEqual('abc');
        expect(user.hasAbility(UserAbility.Debug)).toBeTruthy();
    });

    it('should be able to process successful login requests', async () => {
        const response = {
            success: true,
            userName: 'Jane Doe',
            userToken: 'abc',
            authToken: 'def',
            expirationTime: Number.MAX_SAFE_INTEGER,
            abilities: ['debug'],
        };

        const user = createInstanceForLoginRequest(200, response);

        expect(user.hasAbility(UserAbility.Debug)).toBeFalsy();

        const result = await user.login(kLoginRequest);
        expect(result).toEqual(LoginResult.Success);

        expect(user.hasAbility(UserAbility.Debug)).toBeTruthy();

        expect(user.getUserName()).toEqual('Jane Doe');
        expect(user.getAuthToken()).toEqual('def');
        expect(user.getUserToken()).toEqual('abc');

        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(2);

        expect(localStorage.getItem(UserImpl.kCacheName)).toEqual(JSON.stringify(response));
    });

    it('should ignore unknown abilities for forward compability', async () => {
        const user = createInstanceForLoginRequest(200, {
            success: true,
            userName: 'John Doe',
            userToken: 'abc',
            authToken: 'def',
            expirationTime: Number.MAX_SAFE_INTEGER,
            abilities: ['ignored1', 'debug', 'ignored2'],
        });

        expect(user.hasAbility(UserAbility.Debug)).toBeFalsy();

        const result = await user.login(kLoginRequest);
        expect(result).toEqual(LoginResult.Success);

        expect(user.hasAbility(UserAbility.Debug)).toBeTruthy();
    });

    it('should grant all abilities when Root has been granted to the user', async () => {
        const user = createInstanceForLoginRequest(200, {
            success: true,
            userName: 'John Doe',
            userToken: 'abc',
            authToken: 'def',
            expirationTime: Number.MAX_SAFE_INTEGER,
            abilities: ['root'],
        });

        expect(user.hasAbility(UserAbility.Debug)).toBeFalsy();

        const result = await user.login(kLoginRequest);
        expect(result).toEqual(LoginResult.Success);

        expect(user.hasAbility(UserAbility.Debug)).toBeTruthy();
    });

    it('should fail when processing an invalid login request', async () => {
        const restoreConsole = mockConsole();
        const user = createInstanceForLoginRequest(200, {
            success: false,
        });

        const result = await user.login(kLoginRequest);
        expect(result).toEqual(LoginResult.ErrorUserIssue);

        restoreConsole();
    });

    it('should fail when the login API endpoint is unavailable', async () => {
        const restoreConsole = mockConsole();
        const user = createInstanceForLoginRequest(404, {});

        const result = await user.login(kLoginRequest);
        expect(result).toEqual(LoginResult.ErrorServerIssue);

        restoreConsole();
    });

    it('should fail when the login API endpoint returns invalid data', async () => {
        const restoreConsole = mockConsole();
        const user = createInstanceForLoginRequest(200, {
            success: true,
            missingProperties: true,
        });

        const result = await user.login(kLoginRequest);
        expect(result).toEqual(LoginResult.ErrorServerIssue);

        restoreConsole();
    });

    it('should throw when accessing properties prematurely', () => {
        const configuration = new ConfigurationImpl();
        const user = new UserImpl(configuration);

        expect(user.hasAccount()).toBeFalsy();

        expect(() => user.getUserName()).toThrowError();
        expect(() => user.getAuthToken()).toThrowError();
        expect(() => user.getUserToken()).toThrowError();
    });
});
