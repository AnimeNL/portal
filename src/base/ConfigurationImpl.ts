// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from './Configuration';

/**
 * Default endpoint URLs as defined in the documentation.
 */
const kContentEndpoint = '/api/content';
const kEnvironmentEndpoint = '/api/environment';
const kLoginEndpoint = '/api/login';
const kRegistrationEndpoint = '/api/registration';

/**
 * Implementation of the Configuration interface. Comes with a number of setters usable by the
 * test runner to change behaviour. These should not be used in a production environment.
 */
export class ConfigurationImpl implements Configuration {
    /**
     * The portal will, by default, use the hostname included in the HTTP request. This can be
     * overridden by setting the REACT_APP_API_HOST environmental variable at build time.
     */
    hostname: string;

    /**
     * Override variables that can be set for testing purposes.
     */
    contentOverride?: string;
    environmentOverride?: string;
    loginOverride?: string;
    registrationOverride?: string;

    constructor() {
        this.hostname = process.env.REACT_APP_API_HOST || '';
    }

    getContentEndpoint(): string {
        return this.contentOverride || (this.hostname + kContentEndpoint);
    }

    setContentEndpoint(endpoint: string): void {
        this.contentOverride = endpoint;
    }

    getEnvironmentEndpoint(): string {
        return this.environmentOverride || (this.hostname + kEnvironmentEndpoint);
    }

    setEnvironmentEndpoint(endpoint: string): void {
        this.environmentOverride = endpoint;
    }

    getLoginEndpoint(): string {
        return this.loginOverride || (this.hostname + kLoginEndpoint);
    }

    setLoginEndpoint(endpoint: string): void {
        this.loginOverride = endpoint;
    }

    getRegistrationEndpoint(): string {
        return this.registrationOverride || (this.hostname + kRegistrationEndpoint);
    }

    setRegistrationEndpoint(endpoint: string): void {
        this.registrationOverride = endpoint;
    }
}
