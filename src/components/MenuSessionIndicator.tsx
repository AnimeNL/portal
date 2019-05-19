// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        bubble: {
            padding: `2px ${theme.spacing(1)}px`,

            borderRadius: '11px',
            fontSize: '.9em',
            color: 'white',
        },
    });

/**
 * Properties accepted by the <MenuSessionIndicator> element.
 */
interface Properties {
    /**
     * The number of active sessions for the menu item. Any non-zero value will display a circular
     * bubble indicating the number.
     */
    count: number;

    /**
     * Background colour of the indicator. Should match the theme colour of the floor.
     */
    color: string | undefined;
}

/**
 * The <MenuSessionIndicator> element can be used as the secondary action in a menu. When used and
 * when given a |count| of >0, a round bubble will be shown.
 */
class MenuSessionIndicator extends React.PureComponent<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes, color, count } = this.props;

        // Don't display anything if |count| = 0, since it wouldn't add value.
        if (!count)
            return <></>;

        // Otherwise display a bubble indicating the current count.
        return (
            <ListItemSecondaryAction>
                <Typography className={classes.bubble}
                            style={{ backgroundColor: color }}
                            variant="body2">

                    {count}

                </Typography>

            </ListItemSecondaryAction>
        );
    }
}

export default withStyles(styles)(MenuSessionIndicator);
