// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import ReactDOM from 'react-dom';

import Environment from './Environment';
import LoginController from './controllers/LoginController';
import User from './User';

import ErrorView from '../views/ErrorView';

const kEnvironmentError = 'Unable to load the environment settings.';

/**
 * Main runtime of the volunteer portal. Constructed on pageload. Initialisation may happen
 * asynchronously as part of the initialize() method.
 */
class Application {
    /**
     * Container in which the application should be rendered.
     */
    container: Element;

    /**
     * Environment under which the application is running—a single deployment of the volunteer
     * portal is able to service multiple groups of volunteers.
     */
    environment: Environment;

    /**
     * State tracker for the authentication status of the current user. The volunteer portal is only
     * available to volunteers of the event, so we require people to be logged in.
     */
    user: User;

    constructor(container : Element) {
        this.container = container;
        this.environment = new Environment();
        this.user = new User();
    }

    async initialize(): Promise<void> {
        await this.environment.initialize();

        // The environment must be fully available in order to determine the next steps in routing
        // to the appropriate page. It's loaded from the network, but will be cached to ensure
        // that subsequent pageloads aren't penalized.
        if (!this.environment.isAvailable()) {
            this.displayErrorView(kEnvironmentError);
            return;
        }

        this.user.initialize();

        // Lock the user in to an authentication dialog if they haven't identified themselves yet.
        if (!this.user.isIdentified()) {
            this.displayLoginView();
            return;
        }

        // TODO: Load the event, program and schedule.
        // TODO: Render the volunteer portal.
    }

    /**
     * Displays the authentication page allowing a user to identify themselves with the portal.
     */
    private displayLoginView(): void {
        ReactDOM.render(<LoginController environment={this.environment}
                                         user={this.user} />, this.container);
    }

    /**
     * Displays a fatal error for the given |message|. Application flow should stop after this.
     */
    private displayErrorView(message: string): void {
        ReactDOM.render(<ErrorView message={message} />, this.container);
    }
}

export default Application;
