// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { Colors } from '../Colors';

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
 * Expression used to validate access codes. Must be a positive number between one and ten digits.
 */
const kValidCodeExpression = /^\d{1,10}$/;

/**
 * Expression used to validate e-mail addresses. Based on RFC 2822.
 */
const kValidateEmailExpression = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

/**
 * State internal to the <UserLoginDialog> component.
 */
interface InternalState {
    /**
     * Value of the code field in the dialog form.
     */
    code: string;

    /**
     * Error message for the access code field, if any.
     */
    codeError?: string;

    /**
     * Value of the e-mail field in the dialog form.
     */
    email: string;

    /**
     * Error message for the e-mail field, if any.
     */
    emailError?: string;

    /**
     * Whether the form is currently being validated.
     */
    validating: boolean;
}

/**
 * Properties available to the <UserLoginDialog> component.
 */
interface UserLoginDialogProperties {
    /**
     * A callback that will be invoked when the [Cancel] button has been pressed.
     */
    onCancel: () => void;

    /**
     * A callback that will be invoked when the user is attempting to sign in to their account. The
     * |email| and |code| arguments will have non-empty values for this call. The returned boolean
     * indicates whether the login was successful or not.
     */
    onLogin: (email: string, code: string) => Promise<boolean>;

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
    state: InternalState = {
        code: '',
        email: '',
        validating: false,
    };

    /**
     * Called when the login button has been pressed. The given data will be validated, and, when
     * deemed appropriate, forwarded to the caller that will process the login.
     */
    @bind
    async handleLogin(): Promise<void> {
        const { code, email } = this.state;

        let codeError = '';
        let emailError = '';

        if (!code.length) {
            codeError = 'Veld is verplicht';
        } else if (!kValidCodeExpression.test(code)) {
            codeError = 'Ongeldige toegangscode';
        }

        if (!email.length) {
            emailError = 'Veld is verplicht';
        } else if (!kValidateEmailExpression.test(email.toLowerCase())) {
            emailError = 'Ongeldig e-mailadres';
        }

        // The details can be validated if both error fields are without value.
        const validating = !codeError.length && !emailError.length;

        this.setState({ codeError, emailError, validating });
        if (!validating)
            return;

        const result = await this.props.onLogin(email, code);
        if (!result)
            codeError = 'Onbekende toegangscode.';

        this.setState({ emailError, validating: false });
    }

    /**
     * Called when one of the form fields changes value. This is React's silly method of dealing
     * with input type values. The values will be used in handleLogin().
     */
    @bind
    handleUpdate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        switch (event.target.id) {
            case 'code':
                this.setState({ code: event.target.value });
                break;

            case 'email':
                this.setState({ email: event.target.value });
                break;            

            default:
                throw new Error('Unknown input element: ' + event.target.name);
        }
    }

    render(): JSX.Element {
        const { classes, onCancel, open } = this.props;
        const { code, codeError, email, emailError, validating } = this.state;

        return (
            <Dialog onBackdropClick={onCancel}
                    open={open}>
                <DialogTitle>
                    Inloggen
                </DialogTitle>
                <DialogContent className={classes.removeTopPadding}>
                    <DialogContentText className={classes.contentText}>
                        Toegangscode vergeten? Stuur een e-mailtje naar de <a href="mailto:security@animecon.nl">stewardleiding</a>.
                    </DialogContentText>

                    <TextField error={!!emailError}
                               helperText={emailError || undefined}
                               label="E-mailadres"
                               type="email"
                               onChange={this.handleUpdate}
                               margin="none"
                               value={email}
                               id="email"
                               fullWidth required autoFocus />
                    <TextField error={!!codeError}
                               helperText={codeError || undefined}
                               label="Toegangscode"
                               type="number"
                               onChange={this.handleUpdate}
                               margin="dense"
                               value={code}
                               id="code"
                               fullWidth required />

                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>
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
