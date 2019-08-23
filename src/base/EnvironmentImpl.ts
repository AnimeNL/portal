// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from './Configuration';
import { Environment } from './Environment';
import { IEnvironment } from '../api/IEnvironment';

import { validateNumber, validateString } from './TypeValidators';

/**
 * Message to include with the exception thrown when data is being accessed before the Environment
 * has been initialized properly.
 */
const kExceptionMessage = 'The Environment object has not been successfully initialized yet.';

/**
 * Implementation of the Environment interface, shared across the entire Volunteer Portal.
 */
export class EnvironmentImpl implements Environment {
    private configuration: Configuration;
    private data?: IEnvironment;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    /**
     * Initializes the environment by loading the configuration from the Environment API.
     */
    async initialize(): Promise<boolean> {
        const kErrorPrefix = 'Unable to fetch the environment data: ';

        try {
            const result = await fetch(this.configuration.getEnvironmentEndpoint());
            if (!result.ok) {
                console.error(kErrorPrefix + ` status ${result.status}`);
                return false;
            }

            const unverifiedEnvironment = JSON.parse(await result.text());
            if (!this.validateEnvironment(unverifiedEnvironment))
                return false;

            this.data = unverifiedEnvironment;

            return true;

        } catch (exception) {
            console.error(kErrorPrefix, exception);
        }

        return false;
    }

    /**
     * Validates the given |environment| as data given in the IEnvironment format. Error messages
     * will be sent to the console's error buffer if the data could not be verified.
     */
    validateEnvironment(environment: any) : environment is IEnvironment {
        const kInterfaceName = 'IEnvironment';

        return validateString(environment, kInterfaceName, 'eventName') &&
               validateString(environment, kInterfaceName, 'portalTitle') &&
               validateString(environment, kInterfaceName, 'seniorTitle') &&
               validateString(environment, kInterfaceName, 'timezone') &&
               validateNumber(environment, kInterfaceName, 'year');
    }

    // Environment implementation:

    getEventName(): string {
        if (!this.data)
            throw new Error(kExceptionMessage);

        return this.data.eventName;
    }

    getPortalTitle(): string {
        if (!this.data)
            throw new Error(kExceptionMessage);

        return this.data.portalTitle;
    }

    getSeniorTitle(): string {
        if (!this.data)
            throw new Error(kExceptionMessage);

        return this.data.seniorTitle;
    }

    getTimezone(): string {
        if (!this.data)
            throw new Error(kExceptionMessage);

        return this.data.timezone;
    }

    getYear(): number {
        if (!this.data)
            throw new Error(kExceptionMessage);

        return this.data.year;
    }
}
