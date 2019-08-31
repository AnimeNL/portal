// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { Colors } from '../Colors';
import { LoginControllerContext } from '../controllers/LoginControllerContext';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
    createStyles({
        removeTopPadding: { paddingTop: 0 },

        wrapper: { position: 'relative' },
        loginButtonProgress: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },

        contentText: {
            '& > a ': {
                color: Colors.kHyperlinkColor,
            }
        },
    });

/**
 * State internal to the <UserLoginDialog> component.
 */
interface InternalState {
    /**
     * Value of the access code field in the dialog form.
     */
    accessCode: string;

    /**
     * Value of the e-mail address field in the dialog form.
     */
    emailAddress: string;

    /**
     * The error message that should be displayed to the user.
     */
    errorMessage?: string;

    /**
     * Whether the form is currently being validated.
     */
    validating?: boolean;
}

/**
 * Properties available to the <UserLoginDialog> component.
 */
interface UserLoginDialogProperties {
    /**
     * A callback that will be invoked when login flow has been completed. Will be called with
     * |identified|, which indicates whether the user is now identified to an account.
     */
    onFinished: (identified: boolean) => void;

    /**
     * Whether the user login dialog should be open. It'll be displayed as a modal dialog that
     * can only be closed through one of the action buttons.
     */
    open: boolean;
}

type Properties = UserLoginDialogProperties & WithStyles<typeof styles>;

/**
 * The <UserLoginDialog> component, when triggered, will display a user interface that allows the
 * user to log in to their account.
 */
class UserLoginDialogBase extends React.Component<Properties, InternalState> {
    static contextType = LoginControllerContext;
    
    /**
     * The login context available to the login dialog. Will be set by React.
     */
    context!: React.ContextType<typeof LoginControllerContext>;

    state: InternalState = {
        accessCode: '',
        emailAddress: '',
    };

    /**
     * Called when the user cancels the login request. The dialog will be finished without changing
     * their login state, presumably because they forgot their details or have no account.
     */
    @bind
    handleCancel(): void {
        this.props.onFinished(/* identified= */ false);
    }

    /**
     * Called when the login button has been pressed. The given data will be validated, and, when
     * deemed appropriate, forwarded to the caller that will process the login.
     */
    @bind
    async handleLogin(): Promise<void> {
        const { accessCode, emailAddress } = this.state;

        let errorMessage: string | undefined = '';
        let validating = false;

        if (!accessCode.length)
            errorMessage = 'Toegangscode is verplicht';
        else if (!emailAddress.length)
            errorMessage = 'E-mailadres is verplicht';
        else if (!this.context.validateAccessCode(accessCode))
            errorMessage = 'Toegangscode is niet geldig';
        else if (!this.context.validateEmailAddress(emailAddress))
            errorMessage = 'E-mailadres is niet geldig';

        validating = !errorMessage.length;

        this.setState({ errorMessage, validating });
        if (!validating)
            return;

        // Asynchronously handle the login. This functionality is provided by the LoginController.
        const response = await this.context.requestLogin(accessCode, emailAddress);

        errorMessage = response.message;
        validating = false;

        if (response.result)
            this.props.onFinished(/* identified= */ true);

        this.setState({ errorMessage, validating });
    }

    /**
     * Called when one of the form fields changes value. This is React's silly method of dealing
     * with input type values. The values will be used in handleLogin().
     */
    @bind
    handleUpdate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        switch (event.target.id) {
            case 'accessCode':
                this.setState({ accessCode: event.target.value });
                break;

            case 'emailAddress':
                this.setState({ emailAddress: event.target.value });
                break;            

            default:
                throw new Error('Unknown input element: ' + event.target.name);
        }
    }

    render(): JSX.Element {
        const { classes, open } = this.props;
        const { accessCode, emailAddress, validating } = this.state;

        return (
            <Dialog onBackdropClick={this.handleCancel}
                    open={open}>

                <DialogTitle>
                    Inloggen
                </DialogTitle>

                <DialogContent className={classes.removeTopPadding}>
                    <DialogContentText className={classes.contentText}>
                        Toegangscode vergeten? Stuur een e-mailtje naar de <a href="mailto:security@animecon.nl">stewardleiding</a>.
                    </DialogContentText>

                    <TextField label="E-mailadres"
                               type="email"
                               onChange={this.handleUpdate}
                               margin="none"
                               value={emailAddress}
                               id="emailAddress"
                               fullWidth required autoFocus />

                    <TextField label="Toegangscode"
                               type="number"
                               onChange={this.handleUpdate}
                               margin="dense"
                               value={accessCode}
                               id="accessCode"
                               fullWidth required />

                </DialogContent>

                <DialogActions>
                    <Button onClick={this.handleCancel}>
                        Annuleren
                    </Button>
                    <div className={classes.wrapper}>

                        <Button onClick={this.handleLogin}
                                disabled={validating}
                                color="primary">
                            Inloggen
                        </Button>

                        {validating &&
                            <CircularProgress size={24} className={classes.loginButtonProgress} /> }

                    </div>
                </DialogActions>
                
            </Dialog>
        );
    }
}

export const UserLoginDialog = withStyles(styles)(UserLoginDialogBase);
