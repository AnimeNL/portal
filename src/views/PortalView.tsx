// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { BrowserRouter } from 'react-router-dom'
import MomentUtils from '@date-io/moment';
import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';
import { Environment } from '../base/Environment';
import Event from '../app/Event';
import { Header, HeaderEvents } from '../components/Header';
import Menu from '../components/Menu';
import ResponsiveDrawer from '../components/ResponsiveDrawer';
import { ScheduleNotifier, ScheduleObserver } from '../state/ScheduleNotifier';
import { ScrollBehaviour } from '../components/ScrollBehaviour';
import withRoot from '../withRoot';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import RefreshIcon from '@material-ui/icons/Refresh';
import Snackbar from '@material-ui/core/Snackbar';
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
        toolbar: {
            ...theme.mixins.toolbar,
        },
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
 * State of the <PortalView> component.
 */
interface State {
    /**
     * Whether a schedule update is available.
     */
    updateAvailable: boolean;
}

/**
 * Main layout of the portal that will be presented to logged in users. The view contains three
 * primary components: the header bar, the left-hand side menu and contents of the current page. The
 * application router is rendered as part of this view as well.
 */
class PortalView extends React.Component<Properties & HeaderEvents, State> implements ScheduleObserver {
    state: State = {
        updateAvailable: false
    }

    componentDidMount(): void {
        ScheduleNotifier.addObserver(this);
    }

    componentWillUnmount(): void {
        ScheduleNotifier.removeObserver(this);
    }

    /**
     * Called when the schedule has received an update, and a snackbar should be rendered.
     */
    update(): void {
        this.setState({ updateAvailable: true });
    }

    /**
     * Called when the portal should be refreshed because there is an update.
     */
    @bind
    onRefresh() {
        document.location.reload();
    }

    render() {
        const { children, classes, clock, enableDebug, environment, event } = this.props;
        const { onLogout, onRefresh } = this.props;
        const { updateAvailable } = this.state;

        return (
            <BrowserRouter>
                <ScrollBehaviour />
                <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
                    <div className={classes.root}>

                        <Header event={event}
                                environment={environment}
                                onLogout={onLogout}
                                onRefresh={onRefresh} />

                        <ResponsiveDrawer>
                            <Menu clock={clock}
                                  enableDebug={enableDebug}
                                  event={event} />
                        </ResponsiveDrawer>

                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            {children}
                        </main>

                    </div>

                    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              message="An update is available!"
                              action={[
                                  <Button color="secondary" size="small" onClick={this.onRefresh}>
                                      Refresh
                                  </Button>,
                                  <IconButton color="inherit" onClick={this.onRefresh}>
                                      <RefreshIcon />
                                  </IconButton>
                              ]}
                              open={updateAvailable} />

                </MuiPickersUtilsProvider>
            </BrowserRouter>
        )
    }
}

export default withRoot(withStyles(styles)(PortalView));
