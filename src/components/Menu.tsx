// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import MenuListItem from './MenuListItem';

import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SettingsIcon from '@material-ui/icons/Settings';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        debug: {
            padding: theme.spacing.unit * 2,
            paddingTop: theme.spacing.unit
        }
    });

/**
 * Properties accepted by the <Menu> element.
 */
interface Properties {
    /**
     * Setting on whether debug mode should be enabled for this user.
     */
    enableDebug: boolean;
}

/**
 * The <Menu> element represents the primary navigation for the volunteer portal. It provides access
 * to each of the primary pages and contains a live display of on-going events for areas.
 */
class Menu extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        let debugOptions: JSX.Element | null = null;

        // Users for whom the debug mode is enabled get a number of additional options in the menu
        // that enable them to control and adjust various parts of the application.
        if (this.props.enableDebug) {
            debugOptions = (
                <div>
                    <Divider />

                    <List>

                        <MenuListItem to="/internals">
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Internals" />
                        </MenuListItem>

                    </List>
                </div>
            );
        }

        return (
            <div>
                <List>

                    <MenuListItem to="/" exact>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Overview" />
                    </MenuListItem>

                    <MenuListItem to="/schedule">
                        <ListItemIcon>
                            <ScheduleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Schedule" />
                    </MenuListItem>

                </List>

                {/* TODO: Volunteer groups */}
                {/* TODO: Location areas */}

                {debugOptions}

            </div>
        );
    }
}

export default withStyles(styles)(Menu);
