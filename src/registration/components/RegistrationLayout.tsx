// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { Link } from 'react-router-dom';

import { Colors } from '../Colors';

import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
    createStyles({
        background: {
            position: 'fixed',
            zIndex: -1,

            width: '100vw',
            height: '100vh',

            backgroundAttachment: 'fixed',
            backgroundPosition: 'bottom right',
            backgroundSize: 'cover',

            [theme.breakpoints.down('xs')]: {
                backgroundImage: 'url(https://stewards.team/static/images/background-mobile.jpg)',
            },

            [theme.breakpoints.up('sm')]: {
                backgroundImage: 'url(https://stewards.team/static/images/background-desktop.jpg)',
            },
        },

        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'top',

            '& > a > img': {
                marginTop: '2em',
                maxWidth: '40vw',
                width: '256px'
            },
        },
        content: {
            marginTop: '2em',
            marginBottom: '1em',

            maxWidth: '1280px',
            width: '90%',
        },
        footer: {
            paddingBottom: '125px',

            '& > a': {
                color: Colors.kHyperlinkColor,
            },
        },
    });

/**
 * The <RegistrationLayout> component provides the surrounding UI for the Registration application,
 * such as the background, page header and footer. It's stateless.
 */
class RegistrationLayoutBase extends React.PureComponent<WithStyles<typeof styles>> {
    render(): JSX.Element {
        const { children, classes } = this.props;

        return (
            <>
                <div className={classes.background}></div>
                <div className={classes.container}>
                    <Link to="/registration/">
                        <img src="/static/images/logo-portal.png" alt="J-POP Logo" />
                    </Link>
                    <Paper className={classes.content}>
                        {children}
                    </Paper>
                    <Typography variant="body2" className={classes.footer}>
                        AnimeCon Volunteer Portal — <a href="https://github.com/AnimeNL/portal">source code</a>
                    </Typography>
                </div>
            </>
        );
    }
}

export const RegistrationLayout = withStyles(styles)(RegistrationLayoutBase);
