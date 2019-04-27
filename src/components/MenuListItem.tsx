// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { NavLink } from 'react-router-dom';
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        link: {
            color: 'unset',
            marginRight: theme.spacing.unit,
            textDecoration: 'none',

            display: 'block',
            borderTopRightRadius: 23,
            borderBottomRightRadius: 23,
            overflow: 'hidden',

            WebkitTapHighlightColor: 'transparent',
        },
        activeLink: {
            backgroundColor: theme.palette.action.selected
        },
        listItem: {
            backgroundColor: 'transparent !important',
        },
    });

/**
 * Properties accepted by the <MenuItem> element.
 */
interface Properties {
    /**
     * Destination of the menu item when clicked upon.
     */
    to: string;

    /**
     * Whether exact URL matching should be applied when determining page active state.
     */
    exact?: boolean;

    /**
     * The <MenuItem> element accepts children. TypeScript requires us to be explicit.
     */
    children?: React.ReactNode;
};

/**
 * The <MenuItem> element represents an item in the left-hand-side menu. It ties in seamlessly with
 * the router, and will highlight the item when it's the active page.
 */
class MenuListItem extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { children, classes, exact, to } = this.props;

        return (
            <NavLink className={classes.link} activeClassName={classes.activeLink} exact={!!exact} to={to}>
                <ListItem className={classes.listItem} button>
                    {children}
                </ListItem>
            </NavLink>
        );
    }
}

export default withStyles(styles)(MenuListItem);
