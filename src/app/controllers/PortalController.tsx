// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import bind from 'bind-decorator';

import { Ability } from '../../abilities';
import ApplicationProperties from '../ApplicationProperties';
import EventScheduleController from './EventScheduleController';
import FloorScheduleController from './FloorScheduleController';
import InternalsController from './InternalsController';
import LocationScheduleController from './LocationScheduleController';
import OverviewPage from '../../views/OverviewPage';
import VolunteerListController from './VolunteerListController';
import VolunteerScheduleController from './VolunteerScheduleController';
import { kCacheNames } from '../../config';

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
        if (window.caches)
            await Promise.all(kCacheNames.map(cacheName => caches.delete(cacheName)));

        // Remove the Service Worker registration from controlling this page.
        this.props.serviceWorker.unregister();

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
        if (window.caches)
            await Promise.all(kCacheNames.map(cacheName => caches.delete(cacheName)));

        // TODO: Should we unregister the Service Worker?

        window.location.reload();
    }

    render() {
        const { clock, event, user, environment } = this.props;

        // Utility element that enables using components for routing that should be receiving the
        // same properties as the <PortalController>, on top of the existing routing properties.
        const RouteController = (props: any): JSX.Element => {
            const renderComponent = (routeProps: RouteComponentProps): JSX.Element =>
                React.createElement(props.component, { ...routeProps, ...this.props });

            return <Route path={props.path} render={renderComponent} />;
        };

        const enableDebug = user.hasAbility(Ability.Debug);

        return (
            <PortalView clock={clock}
                        enableDebug={enableDebug}
                        environment={environment}
                        event={event}
                        onLogout={this.onLogout}
                        onRefresh={this.onRefresh}>

                <Switch>

                    {/* Pages specific to the logged in user. */}
                    <RouteController path="/schedule/events/:event" component={EventScheduleController} />
                    <RouteController path="/schedule/floors/:floor" component={FloorScheduleController} />
                    <RouteController path="/schedule/locations/:location" component={LocationScheduleController} />
                    <RouteController path="/volunteers" exact component={VolunteerListController} />
                    <RouteController path="/volunteers/:slug" component={VolunteerScheduleController} />
                    <RouteController path="/" exact component={OverviewPage} />

                    {/* Pages only available to those with debugging privileges. */}
                    { enableDebug && <RouteController path="/internals"
                                                      component={InternalsController} /> }

                </Switch>

            </PortalView>
        );
    }
}

export default PortalController;
