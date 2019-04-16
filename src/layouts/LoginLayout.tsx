// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Button from '@material-ui/core/Button';
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

interface State {
    // Whether an authentication request is being validated.
    validating: boolean;

    // Whether an authentication request has failed.
    failed: boolean;
};

class LoginLayout extends React.Component<WithStyles<typeof styles>, State> {
    state: State = {
        validating: false,
        failed: false,
    };

    render() {
        const { classes } = this.props;

        return (
            <FullPage>

                <Paper className={classes.root} elevation={1}>

                    <Typography component="h1" variant="h5">
                          Volunteer Portal
                    </Typography>
                    <Typography component="p">
                          Enter your e-mail address and four-digit access code to sign in to the
                          volunteer portal. Please talk to a Senior Steward in case you cannot login
                          or forgot your access code.
                    </Typography>

                    <form className={classes.form}>

                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">E-mail address</InputLabel>
                            <Input
                                id="email"
                                name="email"
                                autoComplete="email"
                                autoFocus />
                        </FormControl>

                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="access-code">Access code</InputLabel>
                            <Input
                                id="access-code"
                                name="access-code"
                                autoComplete="current-password"
                                type="number" />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>

                            Sign in

                        </Button>

                    </form>

                </Paper>

            </FullPage>
        )
    }
}

export default withStyles(styles)(LoginLayout);
