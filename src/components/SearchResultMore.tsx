// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import grey from '@material-ui/core/colors/grey';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        moreResults: {
            borderTop: '1px solid ' + theme.palette.divider,
            marginTop: theme.spacing(.5),
            paddingTop: theme.spacing(1.4),
            color: grey[800],
        },
    });

/**
 * Properties for the <SearchResultMore> component.
 */
interface Properties {
    /**
     * The total number of results that could be found.
     */
    hits: number;
}

/**
 * Represents a search result that is not clickable, but includes a total number of results that
 * could be found for a query. The user should be more specific.
 */
class SearchResultMore extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes, hits } = this.props;

        // We like to be pedantic in finishing the details.
        const plural = hits != 1 ? 's' : '';

        return (
            <ListItem className={classes.moreResults}>
                <Typography variant="body2">
                    <strong>{hits}</strong> result{plural} not displayed
                </Typography>
            </ListItem>
        );
    }
}

const StyledSearchResultMore = withStyles(styles)(SearchResultMore);
export { StyledSearchResultMore as SearchResultMore };
