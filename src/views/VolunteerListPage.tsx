// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

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
 * Details necessary for displaying a group of volunteers in the tab bar.
 */
export interface VolunteerGroupDisplayInfo {
    /**
     * The label through which the group can be identified.
     */
    label: string;

    /**
     * The number of volunteers in this group who are currently on a shift.
     */
    activeVolunteers: number;
}

/**
 * Details necessary for displaying the row of an individual volunteer in the list.
 */
export interface VolunteerDisplayInfo {
    /**
     * Name of the volunteer as it should be displayed in the list.
     */
    name: string;
}

/**
 * Properties accepted by the <VolunteerListPage> element.
 */
interface Properties {
    /**
     * The groups of volunteers that should be displayed on the page. Tabs will only show up when
     * there is more than a single group to show.
     */
    groups: VolunteerGroupDisplayInfo[];

    /**
     * The volunteers that should be displayed for the current group of volunteers.
     */
    volunteers: VolunteerDisplayInfo[];

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
            </>
        );
    }
}

const StyledVolunteerListPage = withStyles(styles)(VolunteerListPage);
export { StyledVolunteerListPage as VolunteerListPage };
