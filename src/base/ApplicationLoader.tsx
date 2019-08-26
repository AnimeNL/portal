// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom';

import { ApplicationState } from './ApplicationState';
import { ConfigurationImpl } from './ConfigurationImpl';
import { EnvironmentImpl } from './EnvironmentImpl';
import { UserImpl } from './UserImpl';
import { UserAbility } from './UserAbility';
import { kRegistrationApplicationBasename } from './ApplicationBasename';

/**
 * Message that should be displayed while the application is loading.
 */
const LoadingMessage = (): JSX.Element => <p>Loading application...</p>;

/**
 * Component for lazily loading the registration application.
 */
const RegistrationApplication = React.lazy(() =>
    import(/* webpackChunkName: 'registration' */ '../registration/RegistrationApplication'));

/**
 * Component for lazily loading the legacy application.
 */
const LegacyApplication = () => {
    // TODO: Re-enable the legacy application when updated to the new routing mechanism.
    return <p>LegacyApplication</p>;
};

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
        if (!await this.environment.initialize())
            throw new Error('Unable to initialize the portal environment.');

        if (!await this.user.initialize())
            throw new Error('Unable to initialize the portal user.');

        const container = document.getElementById('root');
        if (!container)
            throw new Error('No elements could be found having @id=`root`.');

        // Initialize the global application state before going any further.
        ApplicationState.initialize(this.configuration, this.environment, this.user);

        this.render(container);
    }

    /**
     * Sets the global context and loads the appropriate application based on routing properties.
     */
    render(container: Element): void {
        ReactDOM.render(
            <BrowserRouter>
                <React.Suspense fallback={<LoadingMessage />}>
                    <Switch>
                        { this.user.hasAbility(UserAbility.RegistrationApplication) &&
                        <Route path={kRegistrationApplicationBasename}
                                component={RegistrationApplication} /> }

                        <Route component={LegacyApplication} />
                    </Switch>
                </React.Suspense>
            </BrowserRouter>, container);
    }
}
