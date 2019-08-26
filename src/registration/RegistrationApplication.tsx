// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import ReactDOM from 'react-dom';
import { Route, RouteComponentProps, Switch } from 'react-router-dom'

import { Application } from '../base/Application';
import { ApplicationState } from '../base/ApplicationState';
import { ContentProvider } from './ContentProvider';
import { RegistrationLayout } from './components/RegistrationLayout';

/**
 * The registration application represents the runtime used for the public registration portal,
 * where visitors can register their interest in joining the volunteering team.
 */
export class RegistrationApplication implements Application {
    private container: Element;
    private contentProvider: ContentProvider;

    constructor(state: ApplicationState) {
        this.container = state.container;
        this.contentProvider = new ContentProvider(state.configuration);
    }

    async initialize(): Promise<void> {
        if (!await this.contentProvider.initialize()) {
            this.renderFatalError('Unable to initialize the content provider.');
            return;
        }

        this.render();
    }

    /**
     * Renders the Registration application's views. The user will be routed to the page of their
     * choice automatically. Each page will be displayed in the same, canonical layout.
     */
    render(): void {
        ReactDOM.render(
            <RegistrationLayout>
                Hello, world!
            </RegistrationLayout>, this.container);
    }

    /**
     * Renders a fatal error that occurred in displaying the Registration application.
     */
    renderFatalError(message: string): void {
        ReactDOM.render(
            <RegistrationLayout>
                {message}
            </RegistrationLayout>, this.container);
    }
}
