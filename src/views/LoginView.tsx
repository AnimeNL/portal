// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FullPage from '../components/FullPage';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
        },
        form: {
            width: '100%',  // Internet Explorer 11 fix
        },
        submit: {
            marginTop: theme.spacing.unit * 3
        },
    });

interface Properties extends WithStyles<typeof styles> {
    // Event that should be invoked when a login attempt is taking place. A promise must be returned
    // that is to be resolved with a boolean once it's known whether the attempt was succesful.
    onLogin: (email: string, accessCode: string) => Promise<boolean>;

    // Title given to the senior volunteer who can assist with login issues.
    seniorTitle: string;
};

interface State {
    // Whether an authentication request is being validated.
    validating: boolean;

    // Whether an authentication request has failed.
    failed: boolean;

    // The e-mail address entered in the form.
    email: string;

    // The access code entered in the form.
    accessCode: string;
};

class LoginView extends React.Component<Properties, State> {
    state: State = {
        validating: false,
        failed: false,
        email: '',
        accessCode: ''
    };

    // Called when input has been received in one of the form fields. The state will be updated.
    updateInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        switch (event.target.name) {
            case 'email':
                this.setState({ email: event.target.value });
                break;

            case 'access-code':
                this.setState({ accessCode: event.target.value });
                break;

            default:
                throw new Error('Unknown input element: ' + event.target.name);
        }
    }

    // Called when the login failed dialog has been closed. Reset the `failed` state to make sure
    // it doesn't automatically re-open again.
    onDialogClose(): void {
        this.setState({ failed: false });
    }

    // Called when the login form is being submitted. Here we authenticate the user with the given
    // details, and sign them in to the volunteer portal if allowed.
    async onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        this.setState({ validating: true });

        // Let the controller deal with the login request.
        const result = await this.props.onLogin(this.state.email, this.state.accessCode);

        this.setState({
            validating: false,
            failed: !result
        });
    }

    render() {
        const { classes, seniorTitle } = this.props;

        return (
            <FullPage>
                <Paper className={classes.root} elevation={1}>
                    <Typography component="h1" variant="h5">
                          Volunteer Portal
                    </Typography>
                    <Typography component="p">
                          Enter your e-mail address and four-digit access code to sign in to the
                          volunteer portal. Please talk to a {seniorTitle} in case you forgot your
                          access code.
                    </Typography>

                    <form onSubmit={e => this.onSubmit(e)} className={classes.form}>

                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">E-mail address</InputLabel>
                            <Input
                                id="email"
                                name="email"
                                value={this.state.email}
                                onChange={e => this.updateInput(e)}
                                autoComplete="email"
                                autoFocus />
                        </FormControl>

                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="access-code">Access code</InputLabel>
                            <Input
                                id="access-code"
                                name="access-code"
                                type="number"
                                value={this.state.accessCode}
                                onChange={e => this.updateInput(e)}
                                autoComplete="current-password" />
                        </FormControl>

                        <Button
                            type="submit"
                            disabled={this.state.validating}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>

                            {this.state.validating ? 'Signing in…' : 'Sign in'}

                        </Button>

                        <Dialog
                            onClose={() => this.onDialogClose()}
                            open={this.state.failed}>

                            <DialogTitle>Unable to sign you in</DialogTitle>
                            <DialogContent>

                                <DialogContentText>
                                    Your login details could not be verified and you could thus not
                                    be logged in. Please talk to a {seniorTitle} in case you forgot
                                    your access code.
                                </DialogContentText>

                                <DialogActions>
                                    <Button
                                        onClick={() => this.onDialogClose()}
                                        color="primary"
                                        autoFocus>

                                        Try again

                                    </Button>
                                </DialogActions>

                            </DialogContent>

                        </Dialog>

                    </form>

                </Paper>
            </FullPage>
        )
    }
}

export default withStyles(styles)(LoginView);
