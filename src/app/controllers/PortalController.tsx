// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { Route } from 'react-router-dom'
import bind from 'bind-decorator';

import Clock from '../Clock';
import Environment from '../Environment';
import User from '../User';

import PortalView from '../../views/PortalView';

/**
 * Properties that must be passed to the <PortalController>. Interaction with these elements will be
 * provided through events made available on the <PortalView> element.
 */
interface Properties {
    clock: Clock;
    environment: Environment;
    user: User;
};

/**
 * The <PortalController> is the main application runtime for logged in users.
 */
class PortalController extends React.Component<Properties> {
    /**
     * Called when the user has requested themselves to be logged out.
     */
    @bind
    async onLogout(): Promise<void> {
        // TODO: Unregister the Service Worker & all cached content here.
        // TODO: Should we care about application root path here?

        // Remove all locally stored login state for the user.
        this.props.user.logout();

        // Reload the current page to force them back to the login screen.
        window.location.reload();
    }

    /**
     * Called when a refresh of the application has been requested.
     */
    @bind
    async onRefresh(): Promise<void> {
        // TODO: Clear Service Worker caches before refreshing the page.
        // TODO: Should we care about application root path here?

        window.location.reload();
    }

    render() {
        const { user, environment } = this.props;

        return (
            <PortalView enableDebug={user.enableDebug}
                        portalTitle={environment.portalTitle}
                        onLogout={this.onLogout}
                        onRefresh={this.onRefresh}>

                <Route path="/internals" render={() => <b>Internals</b>} />
                <Route path="/schedule" render={() => <b>Schedule</b>} />
                <Route path="/" exact render={() => <b>Overview</b>} />

            </PortalView>
        );
    }
}

export default PortalController;
