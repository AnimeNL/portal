// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import bind from 'bind-decorator';

import ApplicationProperties from '../ApplicationProperties';
import Environment from '../Environment';
import InternalsController from './InternalsController';
import OverviewController from './OverviewController';
import ScheduleController from './ScheduleController';
import User from '../User';

import PortalView from '../../views/PortalView';

/**
 * The <PortalController> is the main application runtime for logged in users.
 */
class PortalController extends React.Component<ApplicationProperties> {
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

        // Utility element that enables using components for routing that should be receiving the
        // same properties as the <PortalController>, on top of the existing routing properties.
        const RouteController = (props: any): JSX.Element => {
            const renderComponent = (routeProps: RouteComponentProps): JSX.Element =>
                React.createElement(props.component, { ...routeProps, ...this.props });

            return <Route path={props.path} render={renderComponent} />;
        };

        return (
            <PortalView enableDebug={user.enableDebug}
                        portalTitle={environment.portalTitle}
                        onLogout={this.onLogout}
                        onRefresh={this.onRefresh}>

                <Switch>

                    {/* Pages specific to the logged in user. */}
                    <RouteController path="/schedule" component={ScheduleController} />
                    <RouteController path="/" exact component={OverviewController} />

                    {/* Pages only available to those with debugging privileges. */}
                    { user.enableDebug && <RouteController
                                              path="/internals"
                                              component={InternalsController} /> }

                </Switch>

            </PortalView>
        );
    }
}

export default PortalController;
