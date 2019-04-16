// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { EnvironmentConfigPath } from '../config';

// Represents the environment under which the volunteer portal is operating. Exposes various
// configuration options unique to groups of volunteers.
class Environment {
    available: boolean = false;
    year?: number;

    // Initialization. Will fetch the environment configuration file from the server on pageload.
    // Expensive, but critical to the portal's behaviour.
    async initialize() {
        // TODO: Cache the environment configuration to avoid network access on each pageload.

        try {
            const result = await fetch(EnvironmentConfigPath);
            if (!result.ok) {
                console.error('Unable to fetch the environment configuration.');
                return;
            }

            const config = JSON.parse(await result.text());
            if (!config) {
                console.error('Unable to parse the environment configuration.');
                return;
            }

            if (!this.validateAndParseNumber(config, 'year')) {
                console.error('Unable to parse the year from the environment configuration.');
                return;
            }

            // Mark the environment as being available, as all validation has passed.
            this.available = true;

        } catch (e) {
            console.error('Unable to load the environment configuration.', e);
        }
    }

    // Returns whether the environment is readily available, meaning that it was successfully
    // loaded, parsed and verified.
    isAvailable() : boolean {
        return this.available;
    }

    // Validates the given |field| in the given |config| as a number. The |field| will be written
    // to an identically named property in this class instance when successful.
    private validateAndParseNumber(config: any, field: string): boolean {
        if (!config.hasOwnProperty(field))
            return false;

        const value = Number(config[field]);
        if (isNaN(value))
            return false;

        (this as any)[field] = value;
        return true;
    }

}

export default Environment;
