// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Application } from './Application';
import { ApplicationState } from './ApplicationState';
import { ConfigurationImpl } from './ConfigurationImpl';
import { EnvironmentImpl } from './EnvironmentImpl';
import { UserImpl } from './UserImpl';
import { UserAbility } from './UserAbility';

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

    /**
     * The User instance describing the user representing the client. They may be identified and
     * have a certain set of abilities attached to them.
     */
    private user: UserImpl;

    public constructor() {
        this.configuration = new ConfigurationImpl();
        this.environment = new EnvironmentImpl(this.configuration);
        this.user = new UserImpl(this.configuration);
    }

    /**
     * Initializes the Volunteer Portal application by routing them to the appropriate environment
     * to use the portal in.
     */
    public async initialize(route: string): Promise<void> {
        await this.environment.initialize();
        await this.user.initialize();

        const container = document.getElementById('root');
        if (!container)
            throw new Error('No elements could be found having @id=`root`.');

        const state: ApplicationState = {
            configuration: this.configuration,
            container,
            environment: this.environment,
            user: this.user
        };

        const application = await this.routeToApplication(route, state);

        // Wait for the located application to be initialized.
        await application.initialize();
    }

    /**
     * Identify which application the user has to be routed to based on the |route|. Access to
     * certain applications may be limited by their abilities.
     */
    private async routeToApplication(route: string, state: ApplicationState): Promise<Application> {
        // 1. The public registration application
        if (this.user.hasAbility(UserAbility.RegistrationApplication) &&
                route.startsWith('/hallo')) {
            return this.loadRegistrationApplication(state);
        }

        // DEPRECATED: The legacy portal application.
        return this.loadLegacyApplication(state);
    }

    private async loadLegacyApplication(state: ApplicationState): Promise<Application> {
        const module = await import(/* webpackChunkName: 'legacy' */ '../app/Application');

        return new module.default(state);
    }

    private async loadRegistrationApplication(state: ApplicationState): Promise<Application> {
        const module =
            await import(/* webpackChunkName: 'registration' */ '../registration/RegistrationApplication');
        
        return new module.RegistrationApplication(state);
    }
}
