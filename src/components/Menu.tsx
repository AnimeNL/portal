// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Link } from 'react-router-dom';
import React from 'react';

import MenuListItem from './MenuListItem';

import InboxIcon from '@material-ui/icons/Inbox';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        // ...
    });

/**
 * The <Menu> element represents the primary navigation for the volunteer portal. It provides access
 * to each of the primary pages and contains a live display of on-going events for areas.
 */
class Menu extends React.Component<WithStyles<typeof styles>> {
    render() {
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

            </div>
        );
    }
}

export default withStyles(styles)(Menu);
