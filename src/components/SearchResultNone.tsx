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
 * Represents a search result that indicates that no results could be found.
 */
class SearchResultNone extends React.Component<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        return (
            <ListItem className={classes.noSession}>
                <i>No results could be found.</i>
            </ListItem>
        );
    }
}

const StyledSearchResultNone = withStyles(styles)(SearchResultNone);
export { StyledSearchResultNone as SearchResultNone };
