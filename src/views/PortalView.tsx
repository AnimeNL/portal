// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { BrowserRouter } from 'react-router-dom'
import MomentUtils from '@date-io/moment';
import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';
import Environment from '../app/Environment';
import Event from '../app/Event';
import { Header, HeaderEvents } from '../components/Header';
import Menu from '../components/Menu';
import ResponsiveDrawer from '../components/ResponsiveDrawer';
import withRoot from '../withRoot';

import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        content: {
            flexGrow: 1,
        },
        toolbar: theme.mixins.toolbar,
    });

/**
 * Properties given to the PortalView element. These are required for the portal to be able to
 * effectively route user interaction to the appropriate place, and provide access to the app model.
 */
interface Properties extends WithStyles<typeof styles> {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * Setting on whether debug mode should be enabled for this user.
     */
    enableDebug: boolean;

    /**
     * The event for which the portal is being displayed.
     */
    event: Event;

    /**
     * The environment for this the portal is being displayed.
     */
    environment: Environment;

    /**
     * The <PortalView> element accepts children. TypeScript requires us to be explicit.
     */
    children?: React.ReactNode;
}

/**
 * Dynamic state of the portal view that can change as the user navigates between pages. Each state
 * update at this level may cause parts of the DOM to be re-rendered.
 */
interface State {
    /**
     * Whether the left-side drawer should be open. The drawer will always be opened for users with
     * large screens, but can be toggled by small-screen users.
     */
    drawerOpen: boolean,
}

/**
 * Main layout of the portal that will be presented to logged in users. The view contains three
 * primary components: the header bar, the left-hand side menu and contents of the current page. The
 * application router is rendered as part of this view as well.
 */
class PortalView extends React.Component<Properties & HeaderEvents, State> {
    state: State = {
        drawerOpen: false,
    };

    /**
     * Opens the drawer. No-op for large-screen users, but will create a full-page overlay with a
     * slide-in animation to open the left-hand-side menu for small-screen users.
     */
    @bind
    openDrawer(): void {
        this.setState({
            drawerOpen: true
        })
    }

    /**
     * Closes the drawer. Conventionally this will be called in response to the close event on the
     * <ResponsiveDrawer> event, which handles both out-of-bound clicks and keyboard interactions.
     */
    @bind
    closeDrawer(): void {
        this.setState({
            drawerOpen: false
        });
    }

    render() {
        const { children, classes, clock, enableDebug, environment, event } = this.props;
        const { onLogout, onRefresh } = this.props;

        return (
            <BrowserRouter>
                <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
                    <div className={classes.root}>

                        <Header event={event}
                                environment={environment}
                                onMenuClick={this.openDrawer}
                                onLogout={onLogout}
                                onRefresh={onRefresh} />

                        <ResponsiveDrawer onClose={this.closeDrawer}
                                          open={this.state.drawerOpen}>

                            <Menu clock={clock}
                                  enableDebug={enableDebug}
                                  event={event}
                                  onClick={this.closeDrawer} />

                        </ResponsiveDrawer>

                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            {children}
                        </main>

                    </div>
                </MuiPickersUtilsProvider>
            </BrowserRouter>
        )
    }
}

export default withRoot(withStyles(styles)(PortalView));
