// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom'

import { ContentProvider } from './ContentProvider';
import { UserController } from './controllers/UserController';
import { UserControllerContext } from './controllers/UserControllerContext';
import { kRegistrationApplicationBasename } from '../base/ApplicationBasename';

import { ContentView } from './components/ContentView';
import { RegistrationLayout } from './components/RegistrationLayout';
import { RegistrationView } from './components/RegistrationView';
import { UserHeader } from './components/UserHeader';
import { WelcomeView } from './components/WelcomeView';

/**
 * State that can be maintained by the registration application. Assumed to continue to be mounted
 * while the user continues to look at the registration application itself.
 */
interface InternalState {
    /**
     * Whether the content has loaded and is available for routing purposes.
     */
    contentAvailable: boolean;

    /**
     * The content provider that will provide access to the application's content.
     */
    contentProvider: ContentProvider;

    /**
     * Fatal error message that stops the registration application from working.
     */
    fatalErrorMessage?: string;

    /**
     * Instance of the user controller for the registration application.
     */
    userController: UserController;
}

/**
 * The registration application represents the runtime used for the public registration portal,
 * where visitors can register their interest in joining the volunteering team.
 */
export default class RegistrationApplication extends React.PureComponent<{}, InternalState> {
    state: InternalState = {
        contentAvailable: false,
        contentProvider: new ContentProvider(),
        userController: new UserController(),
    };

    /**
     * Asynchronously loads and initializes the content provider. Updates will be propagated by
     * manipulating the element state, which will cause a re-render.
     */
    componentDidMount(): void {
        const contentProvider = new ContentProvider();
        contentProvider.initialize().then(result => {
            this.setState({
                contentAvailable: result,
                fatalErrorMessage: result ? undefined
                                          : 'Unable to initialize the content provider.'
            });
        });

        this.setState({ contentProvider });
    }

    /**
     * Renders the Registration application's views. The user will be routed to the page of their
     * choice automatically. Each page will be displayed in the same, canonical layout.
     */
    render(): JSX.Element {
        const { contentAvailable, contentProvider, userController, fatalErrorMessage } = this.state;
        const kBasename = kRegistrationApplicationBasename;
        
        // Utility element that enables using components for routing that should be receiving the
        // same properties as the <PortalController>, on top of the existing routing properties.
        const RouteTo = (props: any): JSX.Element => {
            const renderComponent = (routeProps: RouteComponentProps): JSX.Element =>
                React.createElement(props.component, { ...routeProps, contentProvider });

            return <Route path={props.path}
                          exact={props.exact}
                          render={renderComponent} />;
        };

        return (
            <RegistrationLayout>
                <UserControllerContext.Provider value={userController}>

                    <UserHeader />

                    { contentAvailable &&
                        <Switch>
                            { /* The actual registration forms and logic. */ }
                            <RouteTo path={kBasename + "/aanmelden.html"} exact component={RegistrationView} />

                            { /* Include all the content provider's pages in the router. */ }
                            { contentProvider.getPageList().map(url =>
                                    <RouteTo path={url} key={url} exact component={ContentView} />) }

                            { /* Welcome view for users that aren't allowed to access the portal. */ }
                            <RouteTo path="/" exact component={WelcomeView} />

                            { /* Fall-back route that will display the 404 error page. */ }
                            <RouteTo component={ContentView} />
                        </Switch> }

                    { fatalErrorMessage &&
                        <div>
                            <b>Something went wrong</b>: {fatalErrorMessage}
                        </div> }

                  </UserControllerContext.Provider>
            </RegistrationLayout>
        );
    }
}
