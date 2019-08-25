// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Application } from './Application';
import { ApplicationState } from './ApplicationState';
import { ConfigurationImpl } from './ConfigurationImpl';
import { EnvironmentImpl } from './EnvironmentImpl';

/**
 * Main application runtime. Will determine the visitor's identity, if any, and load the appropriate
 * environment for them to be using the portal in.
 */
export class ApplicationLoader {
    /**
     * The portal's configuration. May be influenced by the testing or development environment.
     */
    private configuration: ConfigurationImpl;

    /**
     * The Environment instance describing the portal's conditions.
     */
    private environment: EnvironmentImpl;

    public constructor() {
        this.configuration = new ConfigurationImpl();
        this.environment = new EnvironmentImpl(this.configuration);
    }

    /**
     * Initializes the Volunteer Portal application by routing them to the appropriate environment
     * to use the portal in.
     */
    public async initialize(): Promise<void> {
        // TODO: Handle errors in the environment initialization path.
        await this.environment.initialize();

        const container = document.getElementById('root');
        if (!container)
            throw new Error('No elements could be found having @id=`root`.');

        const state: ApplicationState = {
            configuration: this.configuration,
            environment: this.environment
        };

        // TODO: Find the right approach for user identification + routing + loading the appropriate
        //       application. Right now we're applying either-or.

        const enableRegistration = false;
        const application = enableRegistration
                                ? await this.loadRegistrationApplication(container, state)
                                : await this.loadLegacyApplication(container, state);

        application.initialize();
    }

    private async loadLegacyApplication(container: Element, state: ApplicationState): Promise<Application> {
        const module = await import(/* webpackChunkName: 'legacy' */ '../app/Application');

        return new module.default(container, state);
    }

    private async loadRegistrationApplication(container: Element, state: ApplicationState): Promise<Application> {
        const module =
            await import(/* webpackChunkName: 'registration' */ '../registration/RegistrationApplication');
        
        return new module.RegistrationApplication(/* container, state */);
    }
}
