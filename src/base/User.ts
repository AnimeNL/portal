// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ILoginRequest, ILoginStatus } from '../api/ILogin';

import { UserAbility } from './UserAbility';
import { UserObserver } from './UserObserver';

/**
 * Detailed result statuses for the `login()` function. Should be used when the result has to be
 * visualized to the user, so that they understand what's going on.
 */
export enum LoginResult {
    ErrorConnectionIssue,
    ErrorCookiesDisabled,
    ErrorServerIssue,
    ErrorUserIssue,
    Success,
}

/**
 * Represents the current visitor as a user. Users may be either anonymous visitors or people with
 * an account for this portal.
 */
export interface User {
    /**
     * Returns whether the user has a particular ability. See [[UserAbility]] for a list of
     * abilities that may be assigned to users.
     */
    hasAbility(ability: UserAbility): boolean;

    /**
     * Returns whether the user is identified to an account. This is a prerequisite to their name
     * being known to the system.
     */
    hasAccount(): boolean;

    /**
     * Returns the auth token of the authenticated user. Must only be used if |hasAccount| is true.
     */
    getAuthToken(): string;

    /**
     * Returns the full name of the authenticated user. Must only be used if |hasAccount| is true.
     */
    getUserName(): string;

    /**
     * Returns the user token of the authenticated user. Must only be used if |hasAccount| is true.
     */
    getUserToken(): string;

    /**
     * Returns the status of the user in the volunteer registration process. Must only be used if
     * |hasAccount| is true.
     */
    getStatus(): ILoginStatus;

    /**
     * Attempts to process the login |request|. A promise will be returned that indicates whether
     * the user successfully logged in to an account. If so, the User interface will self-update.
     */
    login(request: ILoginRequest): Promise<LoginResult>;

    /**
     * Logs the user out of their account. Both internal and cached state will be cleared.
     */
    logout(): void;

    /**
     * Enables the |observer| from being able to track user account state changes.
     */
    addObserver(observer: UserObserver): void;

    /**
     * Removes the |observer| from being able to track user account state changes.
     */
    removeObserver(observer: UserObserver): void;
}
