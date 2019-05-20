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
            marginRight: theme.spacing(1),
            textDecoration: 'none',

            display: 'block',
            borderTopRightRadius: 23,
            borderBottomRightRadius: 23,
            overflow: 'hidden',

            WebkitTapHighlightColor: 'transparent',
        },
        activeLink: {
            backgroundColor: theme.menuActiveBackgroundColor,
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

    /**
     * Event listener that will be called when something in the menu has been clicked upon.
     */
    onClick: () => void;
};

/**
 * The <MenuItem> element represents an item in the left-hand-side menu. It ties in seamlessly with
 * the router, and will highlight the item when it's the active page.
 */
class MenuListItem extends React.Component<Properties & WithStyles<typeof styles>> {
    /**
     * Called when the menu list item changes. Effectively matches the PureComponent<> behaviour
     * but ignores a number of properties altogether.
     */
    shouldComponentUpdate(nextProps: Properties): boolean {
        return nextProps.to !== this.props.to ||
               nextProps.exact !== this.props.exact ||
               nextProps.children !== this.props.children;
    }

    render() {
        const { children, classes, exact, onClick, to } = this.props;

        return (
            <NavLink
                activeClassName={classes.activeLink}
                className={classes.link}
                exact={!!exact}
                onClick={onClick}
                to={to}>

                <ListItem className={classes.listItem} button>
                    {children}
                </ListItem>

            </NavLink>
        );
    }
}

export default withStyles(styles)(MenuListItem);
