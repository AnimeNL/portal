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
    environmentOverride?: string;

    getEnvironmentEndpoint(): string {
        return this.environmentOverride || kEnvironmentEndpoint;
    }

    setEnvironmentEndpoint(endpoint: string): void {
        this.environmentOverride = endpoint;
    }
}
