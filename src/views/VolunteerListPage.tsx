// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import bind from 'bind-decorator';

import ApplicationProperties from '../app/ApplicationProperties';
import { TitleManager } from '../state/TitleManager';
import { VolunteerActivityInfo } from '../app/Event';
import { VolunteerGroupTabs, VolunteerGroupTabInfo } from '../components/VolunteerGroupTabs';
import VolunteerListItem from '../components/VolunteerListItem';

import List from '@material-ui/core/List';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        fullWidth: {
            ...theme.fullWidthPaperMixin,
        }
    });

/**
 * Properties available to the controller through the router.
 */
interface RouterProperties {
    /**
     * Index of the active group that should be displayed.
     */
    activeGroupIndex: string;
}

type Properties = ApplicationProperties & RouteComponentProps<RouterProperties>;

/**
 * State of the <VolunteerListPage> component.
 */
interface State {
    /**
     * Index of the tab of volunteers that's currently active.
     */
    activeTabIndex: number;

    /**
     * Tabs that should be displayed on the page.
     */
    tabs: VolunteerGroupTabInfo[];

    /**
     * Volunteers that have to be displayed, with their current activity state.
     */
    volunteers: VolunteerActivityInfo[],
}

/**
 * View that displays the list(s) of volunteers. Each of the volunteers will be identified by their
 * name and an avatar, as well as their title and, if any, their current activity. When there are
 * multiple groups of volunteers, a tab switcher will be shown as well.
 */
class VolunteerListPage extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        activeTabIndex: 0,
        tabs: [],
        volunteers: []
    }

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        let activeTabIndex = 0;
        let activeVolunteer = props.event.getCurrentVolunteer();

        const event = props.event;
        const groups = event.getVolunteerGroups();

        // (1) Populate the list of tabs based on the volunteer groups.
        const tabs = groups.map((info, index) => {
            if (activeVolunteer && activeVolunteer.group === info.group)
                activeTabIndex = index;

            return {
                activeShifts: info.activeShifts,
                label: info.group.label,
            };
        });

        const hash = props.location.hash;

        // (2) Determine the active tab index based on the hash in the URL
        if (hash.length >= 2) {
            const potentialActiveTabIndex = parseInt(hash.substr(1), 10);
            if (potentialActiveTabIndex >= 0 && potentialActiveTabIndex < tabs.length)
                activeTabIndex = potentialActiveTabIndex;
        }

        const activeGroup = groups[activeTabIndex].group;

        // (3) Update the page title to reflect the displayed list of volunteers.
        TitleManager.notify(activeGroup.label);

        // (4) Populate the list of volunteers for the given |activeGroup|.
        const volunteers = event.getVolunteersForGroup(activeGroup);

        return { activeTabIndex, tabs, volunteers };
    }

    /**
     * Called when the list of displayed volunteers should change. Causes a navigation.
     */
    @bind
    onVolunteerGroupChange(tabIndex: number) {
        this.props.history.push('#' + tabIndex);
    }

    render() {
        const { activeTabIndex, tabs, volunteers } = this.state;
        const { classes } = this.props;

        return (
            <>
                <VolunteerGroupTabs activeTabChange={this.onVolunteerGroupChange}
                                    activeTabIndex={activeTabIndex}
                                    tabs={tabs} />

                <List className={classes.fullWidth}>
                    {volunteers.map(volunteer =>
                        <VolunteerListItem key={volunteer.volunteer.userToken}
                                           type="status"
                                           active={volunteer.currentShift &&
                                                       volunteer.currentShift.isEvent()}
                                           unavailable={volunteer.currentShift &&
                                                            volunteer.currentShift.isUnavailable()}
                                           volunteer={volunteer.volunteer}
                                           volunteerActivityInfo={volunteer} /> )}
                </List>
            </>
        );
    }
}

const StyledVolunteerListPage = withStyles(styles)(VolunteerListPage);
export { StyledVolunteerListPage as VolunteerListPage };
