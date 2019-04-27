// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { EnvironmentConfigPath, mockableFetch } from '../config';
import { isNumber, isString } from './util/Validators';

/**
 * Settings for the environment the portal will be operating under. Generally fetched from the
 * Environment API from the network:
 *
 * @see https://github.com/AnimeNL/portal/blob/master/API.md#apienvironment
 */
interface EnvironmentData {
    portalTitle: string;
    seniorTitle: string;
    year: number;
}

/**
 * Represents the environment under which the volunteer portal is operating. Exposes various
 * configuration options unique to groups of volunteers.
 */
class Environment {
    data?: EnvironmentData;

    /**
     * Initialization. Will fetch the environment configuration file from the server on pageload.
     * Expensive, but critical to the portal's behaviour.
     */
    async initialize(): Promise<void> {
        // TODO: Cache the environment configuration to avoid network access on each pageload.
        try {
            const response = await mockableFetch(EnvironmentConfigPath);
            if (!response.ok) {
                console.error('Unable to fetch the environment configuration.');
                return;
            }

            const configuration = JSON.parse(await response.text());
            if (!configuration) {
                console.error('Unable to parse the environment configuration.');
                return;
            }

            if (!this.validateConfiguration(configuration))
                return;

            this.data = configuration;

        } catch (e) {
            console.error('Unable to load the environment configuration.', e);
        }
    }

    /**
     * Returns whether the environment has been successfully loaded and validated and is readily
     * available for use. This means that the getters on this instance may be called.
     */
    isAvailable(): boolean {
        return !!this.data;
    }

    /**
     * Title to use for identifying the volunteer portal instance.
     */
    get portalTitle(): string {
        if (!this.data) throw new Error('The environment is not available.');
        return this.data.portalTitle;
    }

    /**
     * Title to use for senior volunteers, who can provide assistance.
     */
    get seniorTitle(): string {
        if (!this.data) throw new Error('The environment is not available.');
        return this.data.seniorTitle;
    }

    /**
     * Year in which the event will take place.
     */
    get year(): number {
        if (!this.data) throw new Error('The environment is not available.');
        return this.data.year;
    }

    /**
     * Validates that the given |configuration| conforms to the definition of EnvironmentData.
     *
     * @param configuration The configuration as fetched from the network.
     */
    private validateConfiguration(configuration: any): configuration is EnvironmentData {
        if (!isString(configuration.portalTitle)) {
            console.error('Unable to validate EnvironmentData.portalTitle.');
            return false;
        }

        if (!isString(configuration.seniorTitle)) {
            console.error('Unable to validate EnvironmentData.seniorTitle.');
            return false;
        }

        if (!isNumber(configuration.year)) {
            console.error('Unable to validate EnvironmentData.year.');
            return false;
        }

        return true;
    }
}

export default Environment;
