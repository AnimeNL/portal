// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...theme.mixins.gutters(),
            paddingTop: theme.spacing.unit * 2,
            paddingBottom: theme.spacing.unit * 2,
        }
    });

/**
 * Properties accepted by the <InternalsPage> element.
 */
interface Properties {
    // TODO: Define the properties for this element.
}

class InternalsPage extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root} elevation={1}>
               <Typography variant="h5" component="h3">
                    Volunteer Portal Internals
                </Typography>
                <Typography component="p">
                    This page enables you to change internal configuration of the volunteer portal.
                    Right now this page just exists to test layout display however.
                </Typography>
            </Paper>
        );
    }
}

export default withStyles(styles)(InternalsPage);
