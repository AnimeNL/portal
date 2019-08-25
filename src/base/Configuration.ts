// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Interface definition for the application's static configuration. This is known at build time,
 * but can be influenced by the test runner or the production environment.
 */
export interface Configuration {
    /**
     * Returns a URL to the endpoint where data of the Content API can be obtained.
     * @see https://github.com/AnimeNL/portal/blob/master/API.md#apicontent
     */
    getContentEndpoint(): string;

    /**
     * Returns a URL to the endpoint where data of the Environment API can be obtained.
     * @see https://github.com/AnimeNL/portal/blob/master/API.md#apienvironment
     */
    getEnvironmentEndpoint(): string;
}
