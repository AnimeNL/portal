// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import grey from '@material-ui/core/colors/grey';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        noSession: {
            color: grey[600],
        },
    });

/**
 * Represents a row that's to be displayed in a <LocationCard>, detailing that there are no more
 * sessions to be hosted in that location.
 */
class LocationFinished extends React.Component<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        return (
            <ListItem className={classes.noSession}>
                <i>No more scheduled events in this location.</i>
            </ListItem>
        );
    }
}

const StyledLocationFinished = withStyles(styles)(LocationFinished);
export { StyledLocationFinished as LocationFinished };
