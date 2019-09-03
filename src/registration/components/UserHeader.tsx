// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import bind from 'bind-decorator';

import { ApplicationState } from '../../base/ApplicationState';
import { Colors } from '../Colors';
import { UserApplicationProgress } from './UserApplicationProgress';
import { UserLoginDialog } from './UserLoginDialog';
import { UserObserver } from '../../base/UserObserver';
import { kRegistrationApplicationBasename } from '../../base/ApplicationBasename';

import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import amber from '@material-ui/core/colors/amber';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
    createStyles({
        hide: { display: 'none' },
        noMargin: { marginTop: '0px !important' },

        root: {
            backgroundColor: Colors.kContrastBackgroundColor,
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
            color: Colors.kContrastForegroundColor,
            padding: theme.spacing(1, 2, 1, 2),

            display: 'flex',
            alignItems: 'center',
        },
        title: {
            flexGrow: 1,
            lineHeight: '38px',
        },
        status: {
            padding: theme.spacing(2),
            backgroundColor: amber[50],
        },
    });

/**
 * Returns a personalised, welcoming title based on the user's first name.
 */
const personaliseTitle = (fullName: string) => 'Welkom ' + fullName.replace(/\s.*/, '') + '!';

/**
 * Utility function to quickly get access to the User object.
 */
const getUser = () => ApplicationState.getUser();

/**
 * State internal to the <UserHeader> component.
 */
interface InternalState {
    /**
     * Whether the action at the top-right side of the header bar should be available.
     */
    actionAvailable: boolean;

    /**
     * Whether the user has identified to an account. This reflects the available options.
     */
    identified?: boolean;

    /**
     * Whether the login dialog should be displayed to the user.
     */
    loginDialogDisplayed?: boolean;

    /**
     * Whether the status of the signed in user's application should be displayed.
     */
    statusDisplayed?: boolean;

    /**
     * Page title that should be displayed, either the portal title or the name of the user that's
     * logged in to their account.
     */
    title: string;
}

type Properties = RouteComponentProps & WithStyles<typeof styles>;

/**
 * The <UserHeader> component is displayed on top of every page on the registration portal. Users
 * have the ability to identify themselves to see the progress of their application.
 */
class UserHeaderBase extends React.Component<Properties, InternalState> implements UserObserver {
    state: InternalState = {
        actionAvailable: false,
        title: 'Volunteer Portal',
    };

    componentDidMount() {
        getUser().addObserver(this);

        // Manually trigger an `onUserAccountStateChange` notification to set the initial state for
        // this component. Future changes will automatically propagate.
        this.onUserAccountStateChange(/* isInitialState= */ true);
    }

    componentDidUpdate(prevProps: Properties): void {
        const { props, state } = this;

        if (props.location.pathname === prevProps.location.pathname)
            return;
        
        const actionAvailable = this.shouldActionBeAvailable();
        const statusDisplayed = false;

        if (state.actionAvailable === actionAvailable && state.statusDisplayed === statusDisplayed)
            return;
        
        this.setState({ actionAvailable, statusDisplayed });
    }

    componentWillUnmount() {
        getUser().removeObserver(this);
    }

    /**
     * Called by the User interface whenever the user's login state changes.
     */
    onUserAccountStateChange(isInitialState?: boolean): void {
        const environment = ApplicationState.getEnvironment();
        const user = getUser();

        const actionAvailable = this.shouldActionBeAvailable();

        const identified = user.hasAccount();
        const title = identified ? personaliseTitle(user.getUserName())
                                 : environment.getPortalTitle();

        this.setState({ actionAvailable, identified, title });

        // Automatically open the Status display after logging in to provide the user with some
        // feedback, otherwise it looks like the dialog just silently disappeared.
        if (!isInitialState && !!identified)
            requestAnimationFrame(() => this.setState({ statusDisplayed: true }));
    }

    /**
     * Returns whether the action should be available on the current page.
     */
    private shouldActionBeAvailable(): boolean {
        return this.props.location.pathname.startsWith(kRegistrationApplicationBasename);
    }

    @bind
    onLogin(): void {
        this.setState({ loginDialogDisplayed: true });
    }

    @bind
    onLoginFinished(identified: boolean): void {
        this.setState({ loginDialogDisplayed: false });
    }

    /**
     * Toggles display of the status overflow, which displays where in the sign-up process the user
     * is. The actual user status is conveyed to us as an ability.
     */
    @bind
    toggleStatusDisplay(): void {
        this.setState({ statusDisplayed: !this.state.statusDisplayed });
    }

    render(): JSX.Element {
        const { classes } = this.props;
        const { actionAvailable, identified, loginDialogDisplayed, statusDisplayed, title } = this.state;

        if (identified) {
            return (
                <>
                    <div className={classes.root}>
                        <Typography variant="h6" component="h1" className={classes.title}>
                            {title}
                        </Typography>
                        { actionAvailable &&
                            <Button color="inherit" onClick={this.toggleStatusDisplay}>
                                Status
                            </Button> }
                    </div>

                    <ExpansionPanel expanded={!!statusDisplayed} className={classes.noMargin}>
                        <ExpansionPanelSummary className={classes.hide} />
                        <ExpansionPanelDetails className={classes.status}>
                            <UserApplicationProgress state="received" />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </>
            );
        } else {
            return (
                <>
                    <div className={classes.root}>
                        <Typography variant="h6" component="h1" className={classes.title}>
                            {title}
                        </Typography>
                        { actionAvailable &&
                            <Button color="inherit" onClick={this.onLogin}>
                                Inloggen
                            </Button> }
                    </div>

                    <UserLoginDialog onFinished={this.onLoginFinished}
                                     open={!!loginDialogDisplayed} />
                </>
            );
        }
    }
}

export const UserHeader = withRouter(withStyles(styles)(UserHeaderBase));
