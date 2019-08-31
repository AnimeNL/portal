// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { ApplicationState } from '../../base/ApplicationState';
import { Colors } from '../Colors';
import { UserLoginDialog } from './UserLoginDialog';

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
        },
        status: {
            backgroundColor: amber[50],
        },
    });

/**
 * Returns a personalised, welcoming title based on the user's first name.
 */
const personaliseTitle = (fullName: string) => 'Welkom ' + fullName.replace(/\s.*/, '') + '!';

/**
 * State internal to the <UserHeader> component.
 */
interface InternalState {
    /**
     * Whether the user has identified to an account. This reflects the available options.
     */
    identified: boolean;

    /**
     * Whether the login dialog should be displayed to the user.
     */
    loginDialogDisplayed: boolean;

    /**
     * Whether the status of the signed in user's application should be displayed.
     */
    statusDisplayed: boolean;

    /**
     * Page title that should be displayed, either the portal title or the name of the user that's
     * logged in to their account.
     */
    title: string;
}

/**
 * The <UserHeader> component is displayed on top of every page on the registration portal. Users
 * have the ability to identify themselves to see the progress of their application.
 */
class UserHeaderBase extends React.PureComponent<WithStyles<typeof styles>, InternalState> {
    state: InternalState = {
        identified: false,
        loginDialogDisplayed: false,
        statusDisplayed: false,
        title: 'Volunteer Portal',
    };

    componentDidMount() {
        const environment = ApplicationState.getEnvironment();
        const user = ApplicationState.getUser();

        const identified = user.hasAccount();
        const title = identified ? personaliseTitle('Peter Beverloo')
                                 : environment.getPortalTitle();

        this.setState({ identified, title });
    }

    @bind
    onLogin(): void {
        this.setState({ loginDialogDisplayed: true });
    }

    @bind
    onLoginFinished(identified: boolean): void {
        if (identified !== this.state.identified)
            this.componentDidMount();

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
        const { identified, loginDialogDisplayed, statusDisplayed, title } = this.state;

        if (identified) {
            return (
                <>
                    <div className={classes.root}>
                        <Typography variant="h6" component="h1" className={classes.title}>
                            {title}
                        </Typography>
                        <Button color="inherit" onClick={this.toggleStatusDisplay}>
                            Status
                        </Button>
                    </div>

                    <ExpansionPanel expanded={statusDisplayed} className={classes.noMargin}>
                        <ExpansionPanelSummary className={classes.hide} />
                        <ExpansionPanelDetails className={classes.status}>
                            Hello, world!
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
                        <Button color="inherit" onClick={this.onLogin}>
                            Inloggen
                        </Button>
                    </div>

                    <UserLoginDialog onFinished={this.onLoginFinished}
                                     open={loginDialogDisplayed} />
                </>
            );
        }
    }
}

export const UserHeader = withStyles(styles)(UserHeaderBase);
