// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            minHeight: '100%',
            minWidth: '100%',

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

            backgroundPosition: 'bottom right',
            backgroundSize: 'cover',

            [theme.breakpoints.down('xs')]: {
                backgroundImage: 'url(https://stewards.team/static/images/background-mobile.jpg)',
            },

            [theme.breakpoints.up('sm')]: {
                backgroundImage: 'url(https://stewards.team/static/images/background-desktop.jpg)',
            },

            '& > img': { maxWidth: '60vw' },
        },
        content: {
            marginTop: '2em',
            marginBottom: '1em',
            width: '90%',
        },
        footer: {
            paddingBottom: '125px',
            fontSize: '.8em',
            '& > a': {
                color: '#4E342E',
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
            <div className={classes.container}>
                <img src="https://stewards.team/static/images/logo-portal.png" alt="J-POP AnimeCon 2020 logo" />
                <Paper className={classes.content}>
                    {children}
                </Paper>
                <Typography variant="body2" className={classes.footer}>
                    AnimeCon Volunteer Portal — <a href="https://github.com/AnimeNL/portal">source code</a>
                </Typography>
            </div>
        );
    }
}

export const RegistrationLayout = withStyles(styles)(RegistrationLayoutBase);
