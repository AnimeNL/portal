// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from './Configuration';

/**
 * Default endpoint URLs as defined in the documentation.
 */
const kEnvironmentEndpoint = '/api/environment';

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
    environmentOverride?: string;

    constructor() {
        this.hostname = process.env.REACT_APP_API_HOST || '';
    }

    getEnvironmentEndpoint(): string {
        return this.environmentOverride || (this.hostname + kEnvironmentEndpoint);
    }

    setEnvironmentEndpoint(endpoint: string): void {
        this.environmentOverride = endpoint;
    }
}