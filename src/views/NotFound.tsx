// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import { withStyles } from '@material-ui/core/styles';

/**
 *
 */
const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing.unit * 3
        },
        message: {
            paddingTop: theme.spacing.unit * 3
        }
    });

/**
 * Error page that will be displayed when the requested page could not be found. This could either
 * be due to an invalid URL, or due to changed state due to a volunteer leaving.
 */
function NotFound(props : any) {
    const { classes } = props;

    return (
        <Grid
            container
            className={classes.root}
            alignItems="center"
            direction="column"
            justify="center">

            <img src="/static/images/404.png" />
            <Typography className={classes.message} component="p" variant="h5">
                Whoops!
            </Typography>
            <Typography component="p" variant="body2">
                This page could not be found.
            </Typography>

        </Grid>
    );
}

export default withStyles(styles)(NotFound);
