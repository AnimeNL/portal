// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import { kDrawerWidth } from '../config';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        maximumWidthHeader: {
            maxWidth: '100vw',
            [theme.breakpoints.up('sm')]: {
                // Take away an extra 17px to compensate for the scrollbar that's always visible.
                maxWidth: 'calc(100vw - 17px - ' + kDrawerWidth + 'px)',
            },
            marginBottom: theme.spacing(2),
        },
        noWrap: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    });

/**
 * Information necessary to render the header of a page.
 */
export interface PageHeaderProps {
    /**
     * Link to a reference contained in an SVG file to display as the icon, if any.
     */
    icon?: string;

    /**
     * Colour to render the icon in. Must be set when |icon| is given.
     */
    iconColor?: string;

    /**
     * Second line to display as part of the header for this page.
     */
    subtitle: string;

    /**
     * First line to display as part of the header for this page.
     */
    title: string;
}

/**
 * Default value for the PageHeader component when none are available yet.
 */
export const PageHeaderDefaults: PageHeaderProps = {
    subtitle: 'No description has been given.',
    title: 'Unknown',
};

/**
 * Common component for page headers shown across the application.
 */
class PageHeader extends React.Component<PageHeaderProps & WithStyles<typeof styles>> {
    render() {
        const { classes, icon, iconColor, subtitle, title } = this.props;

        return (
            <Paper className={classes.maximumWidthHeader} square>
                <List>
                    <ListItem>

                        { icon &&
                            <ListItemAvatar>
                                <Avatar style={{ backgroundColor: iconColor }}>
                                    <SvgIcon htmlColor="white">
                                        <use xlinkHref={icon} />
                                    </SvgIcon>
                                </Avatar>
                            </ListItemAvatar>}

                        <ListItemText className={classes.noWrap}
                                      primary={title}
                                      primaryTypographyProps={{ noWrap: true }}
                                      secondary={subtitle}
                                      secondaryTypographyProps={{ noWrap: true }} />

                    </ListItem>
                </List>
            </Paper>
        );
    }
}

const StyledPageHeader = withStyles(styles)(PageHeader);
export { StyledPageHeader as PageHeader };
