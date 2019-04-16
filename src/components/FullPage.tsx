// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Grid from '@material-ui/core/Grid';
import createStyles from '@material-ui/core/styles/createStyles';
import withRoot from '../withRoot';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = () =>
    createStyles({
        container: {
            minHeight: '100vh',
            padding: '2vh 4vh 8vh 4vh',
            position: 'fixed',
        },
        '@media (min-width: 681px)': {
            container: {
                background: 'url(/static/images/background-desktop.jpg) top left / cover',
            },
        },
        '@media (max-width: 680px)': {
            container: {
                background: 'url(/static/images/background-mobile.jpg) top left / cover',
            },
        }
    });

class FullPage extends React.Component<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        return (
            <Grid
                container
                alignItems="center"
                justify="center"
                className={classes.container}>

                <Grid item>

                    {this.props.children}

                </Grid>

            </Grid>
        )
    }
}

export default withRoot(withStyles(styles)(FullPage));
