// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Configuration } from './Configuration';
import { Environment } from './Environment';
import { User } from './User';

/**
 * Interface that defines the properties that will be shared to applications by the loader.
 */
export class ApplicationState {
    private static configuration: Configuration;
    private static environment: Environment;
    private static user: User;

    /**
     * Initializes the ApplicationState for first-time usage.
     */
    public static initialize(configuration: Configuration,
                             environment: Environment,
                             user: User): void {
        ApplicationState.configuration = configuration;
        ApplicationState.environment = environment;
        ApplicationState.user = user;
    }

    /**
     * Returns the global Configuration object.
     */
    public static getConfiguration(): Configuration {
        return ApplicationState.configuration;
    }

    /**
     * Returns the global Environment object.
     */
    public static getEnvironment(): Environment {
        return ApplicationState.environment;
    }

    /**
     * Returns the global User object.
     */
    public static getUser(): User {
        return ApplicationState.user;
    }
};
