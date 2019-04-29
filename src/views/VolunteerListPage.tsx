// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import { Volunteer } from '../app/Volunteer';
import { VolunteerGroup } from '../app/VolunteerGroup';
import VolunteerListItem from '../components/VolunteerListItem';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        // TODO: Define the styles for this element.
    });

/**
 * Properties accepted by the <VolunteerListPage> element.
 */
interface Properties {
    /**
     * The groups of volunteers that should be displayed on the page. Tabs will only show up when
     * there is more than a single group to show.
     */
    groups: VolunteerGroup[];

    /**
     * The volunteers that should be displayed for the current group of volunteers.
     */
    volunteers: Volunteer[];

    /**
     * Index of the active group of volunteers as available in |groups|.
     */
    activeGroupIndex: number;

    /**
     * Event to invoke when the group of volunteers that is to be displayed changes.
     */
    onVolunteerGroupChange: (groupIndex: number) => void;
}

/**
 * View that displays the list(s) of volunteers. Each of the volunteers will be identified by their
 * name and an avatar, as well as their title and, if any, their current activity. When there are
 * multiple groups of volunteers, a tab switcher will be shown as well.
 */
class VolunteerListPage extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { activeGroupIndex, groups, onVolunteerGroupChange, volunteers } = this.props;

        let tabs: JSX.Element | null = null;

        // Only display the tab switcher when there are multiple groups of volunteers.
        if (groups.length >= 2) {
            tabs = (
                <Paper square>
                    <Tabs
                        value={activeGroupIndex}
                        onChange={(e, groupIndex) => onVolunteerGroupChange(groupIndex)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth">

                        {groups.map(group => {
                            return (
                                <Tab label={group.label} />
                            );
                        })}

                    </Tabs>
                </Paper>
            );
        }

        return (
            <>
                {tabs}
                <List>
                    {volunteers.map(volunteer => {
                        return <VolunteerListItem volunteer={volunteer} type="status" />;
                    })}
                </List>
            </>
        );
    }
}

const StyledVolunteerListPage = withStyles(styles)(VolunteerListPage);
export { StyledVolunteerListPage as VolunteerListPage };
