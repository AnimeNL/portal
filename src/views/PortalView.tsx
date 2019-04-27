// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import bind from 'bind-decorator';

import { Header, HeaderEvents } from '../components/Header';
import Menu from '../components/Menu';
import ResponsiveDrawer from '../components/ResponsiveDrawer';
import withRoot from '../withRoot';

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
     * Setting on whether debug mode should be enabled for this user.
     */
    enableDebug: boolean;

    /**
     * Title to use for identifying the volunteer portal instance.
     */
    portalTitle: string;

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

    /**
     * Title that should be displayed in the header bar.
     */
    title?: string;
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
     * Called just before the <PortalView> is mount. The |title| state will be set to the portal
     * title made available as a property on this component.
     */
    componentWillMount() {
        this.setState({
            title: this.props.portalTitle
        });
    }

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
        const { children, classes, enableDebug, onLogout, onRefresh } = this.props;

        return (
            <BrowserRouter>
                <div className={classes.root}>

                    <Header onMenuClick={this.openDrawer}
                            onLogout={onLogout}
                            onRefresh={onRefresh}>

                        {this.state.title}

                    </Header>

                    <ResponsiveDrawer
                        onClose={this.closeDrawer}
                        open={this.state.drawerOpen}>

                        <Menu enableDebug={enableDebug} />

                    </ResponsiveDrawer>

                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {children}
                    </main>

                </div>
            </BrowserRouter>
        )
    }
}

export default withRoot(withStyles(styles)(PortalView));
