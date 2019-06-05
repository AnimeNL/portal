// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

/**
 * A <Badge> component with styling adjusted to our needs.
 */
const StyledBadge = withStyles(theme => ({
    badge: {
        color: theme.palette.secondary.main,
        marginRight: theme.spacing(-1),
        marginTop: theme.spacing(.25),
    }
}))(Badge);

/**
 * Interface describing the necessary information to display on the volunteer groups.
 */
export interface VolunteerGroupTabInfo {
    /**
     * Number of active shifts within this volunteer group.
     */
    activeShifts?: number;

    /**
     * Label that describes this volunteer group.
     */
    label: string;
}

/**
 * Properties accepted by the <VolunteerGroupTabs> element.
 */
interface Properties {
    /**
     * Event that's to be called when the active tab changes.
     */
    activeTabChange: (tabIndex: number) => void;

    /**
     * Index of the active tabs within the |tabs| array.
     */
    activeTabIndex: number;

    /**
     * Tabs that should be displayed for the volunteer groups.
     */
    tabs: VolunteerGroupTabInfo[];
}

/**
 * Displays a tab group for a number of volunteers, in case there are multiple. Nothing will be
 * displayed when there's just one tab to display.
 */
export class VolunteerGroupTabs extends React.PureComponent<Properties> {
    render() {
        const { activeTabChange, activeTabIndex, tabs } = this.props;

        if (tabs.length <= 1)
            return <></>;

        return (
            <Paper square>
                <Tabs
                    value={activeTabIndex}
                    onChange={(e, tabIndex) => activeTabChange(tabIndex)}
                    indicatorColor="primary"
                    variant="fullWidth">

                    { tabs.map((tab, index) => {
                        const label = !tab.activeShifts
                                          ? tab.label
                                          : <StyledBadge badgeContent={tab.activeShifts}>
                                                {tab.label}
                                            </StyledBadge>;

                        return <Tab key={index} label={label} />;
                    }) }

                </Tabs>
            </Paper>
        );
    }
}
