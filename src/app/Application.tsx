// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import ReactDOM from 'react-dom';

import { ApplicationState } from '../base/ApplicationState';
import { Environment } from '../base/Environment';

import Clock from './Clock';
import Event from './Event';
import LoginController from './controllers/LoginController';
import PortalController from './controllers/PortalController';
import { ServiceWorkerManager } from './ServiceWorkerManager';
import { TitleManager, TitleObserver } from '../state/TitleManager';
import User from './User';

import ErrorView from '../views/ErrorView';

const kEventError = 'Unable to load the event information.';

/**
 * Main runtime of the volunteer portal. Constructed on pageload. Initialisation may happen
 * asynchronously as part of the initialize() method.
 */
class Application implements TitleObserver {
    /**
     * Container in which the application should be rendered.
     */
    container: Element;

    /**
     * The clock that provides time to the application. Global to the Application given that it can
     * be manipulated for debugging and testing purposes.
     */
    clock: Clock;

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

    /**
     * Contains information from the event that this portal is about. Must be initialized when the
     * user information is available. Has the ability to forcefully sign out the user.
     */
    event: Event;

    /**
     * The Service Worker maanger is responsible for providing the offline functionality of the
     * portal, as well as access to powerful PWA features such as Web Push Notifications.
     */
    serviceWorkerManager: ServiceWorkerManager;

    constructor() {
        this.container = document.getElementById('root')!;
        this.clock = new Clock();
        this.user = new User();
        this.environment = ApplicationState.getEnvironment();
        this.event = new Event();

        this.serviceWorkerManager = new ServiceWorkerManager();
        this.serviceWorkerManager.register();
    }

    async initialize(): Promise<void> {
        this.clock.setTimezone(this.environment.getTimezone());
        this.user.initializeFromLocalStorage();

        // Lock the user in to an authentication dialog if they haven't identified themselves yet.
        if (!this.user.isIdentified()) {
            this.displayLoginView();
            return;
        }

        await this.event.load(this.user, this.clock);

        // The event must be available in order to display anything sensible in the volunteer
        // portal. Bail out if it can't be loaded for any reason.
        if (!this.event.isAvailable()) {
            this.displayErrorView(kEventError);
            return;
        }

        // Listen to title updates, to update the document's title.
        TitleManager.addObserver(this);

        this.displayPortalView();
    }

    /**
     * Will be called by the TitleManager when the page title updates.
     */
    update(title: string | null): void {
        const portalTitle = this.environment.getPortalTitle();

        document.title = title ? title + ' | ' + portalTitle
                               : portalTitle;
    }

    /**
     * Displays the portal view containing the information that's actually useful for the volunteer.
     */
    private displayPortalView(): void {
        ReactDOM.render(<PortalController clock={this.clock}
                                          environment={this.environment}
                                          event={this.event}
                                          user={this.user}
                                          serviceWorker={this.serviceWorkerManager} />, this.container);
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
