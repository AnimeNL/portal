// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Event from '../app/Event';
import { Floor } from '../app/Floor';
import MenuListItem from './MenuListItem';
import MenuSessionIndicator from './MenuSessionIndicator';
import slug from '../app/util/Slug';

import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SettingsIcon from '@material-ui/icons/Settings';
import SvgIcon from '@material-ui/core/SvgIcon';

/**
 * Properties accepted by the <Menu> element.
 */
interface Properties {
    /**
     * Setting on whether debug mode should be enabled for this user.
     */
    enableDebug: boolean;

    /**
     * The event for which the menu is being displayed.
     */
    event: Event;

    /**
     * Event listener that will be called when something in the menu has been clicked upon.
     */
    onClick: () => void;
}

/**
 * Information necessary to display the menu item for a particular floor, obtained from the event
 * program, and updated when the relevant information passes. This data matches that of the
 * properties available in the Floor interface.
 */
interface FloorDisplayInfo {
    id: number;
    link: string;
    label: string;
    icon: string;
    iconColor: string;
    activeSessionCount: number;
}

/**
 * State of the <Menu> element. Will be periodically updated.
 */
interface State {
    /**
     * Label to use for linking to the list of volunteers for this event.
     */
    volunteersLabel: string;

    /**
     * Sorted list of floors that should be displayed in the menu.
     */
    floors: FloorDisplayInfo[];
}

/**
 * The <Menu> element represents the primary navigation for the volunteer portal. It provides access
 * to each of the primary pages and contains a live display of on-going events for areas.
 */
class Menu extends React.Component<Properties, State> {
    state: State = {
        volunteersLabel: 'Volunteers',
        floors: []
    }

    componentWillMount() {
        const { event } = this.props;

        // Determine name to for the Volunteers menu item. If the logged in user only has access to
        // a single group, specialize the display.
        const volunteerGroups = Array.from(event.getVolunteerGroups());
        if (volunteerGroups.length === 1)
            this.setState({ volunteersLabel: volunteerGroups[0].label });

        // Populate the list of floors available for the event. The counter will continue to update
        // as time goes on, to ensure we have up-to-date information.
        this.computeFloorInformation();
    }

    /**
     * Computes the current state regarding the floors available for this event. A re-count will
     * happen for all the sessions to determine the active ones.
     */
    private computeFloorInformation(): void {
        const event = this.props.event;
        const floors: FloorDisplayInfo[] = [];

        for (const floor of event.getFloors()) {
            if (!floor.icon || !floor.iconColor)
                continue;

            floors.push({
                id: floor.id,
                link: '/schedule/floors/' + floor.id + '/' + slug(floor.label),
                label: floor.label,
                icon: floor.icon,
                iconColor: floor.iconColor,
                activeSessionCount: 0
            });
        }

        this.setState({ floors });
    }

    render() {
        const { enableDebug, event } = this.props;
        const { floors, volunteersLabel } = this.state;

        let debugOptions: JSX.Element | null = null;

        // Users for whom the debug mode is enabled get a number of additional options in the menu
        // that enable them to control and adjust various parts of the application.
        if (enableDebug) {
            debugOptions = (
                <div>
                    <Divider />

                    <List>

                        <MenuListItem to="/internals" onClick={this.props.onClick}>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Internals" />
                        </MenuListItem>

                    </List>
                </div>
            );
        }

        const volunteer = event.getCurrentVolunteer();

        // Link to the page that contains the schedule of the volunteer that's currently logged in,
        // if the user is associated with a volunteer.
        const volunteerScheduleLink = volunteer ? '/volunteers/' + slug(volunteer.name)
                                                : null;

        return (
            <div>
                <List>

                    <MenuListItem to="/" exact onClick={this.props.onClick}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Overview" />
                    </MenuListItem>

                    { volunteerScheduleLink &&
                        <MenuListItem to={volunteerScheduleLink} exact onClick={this.props.onClick}>
                            <ListItemIcon>
                                <ScheduleIcon />
                            </ListItemIcon>
                            <ListItemText primary="My schedule" />
                        </MenuListItem>
                    }

                </List>

                <Divider />

                <List>

                    <MenuListItem to="/volunteers" exact onClick={this.props.onClick}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary={volunteersLabel} />
                    </MenuListItem>

                </List>

                <Divider />

                <List>

                    { floors.map((floor: FloorDisplayInfo) => {
                        return (
                            <MenuListItem
                                key={floor.id}
                                to={floor.link}
                                onClick={this.props.onClick}>

                                <ListItemIcon>
                                    <SvgIcon nativeColor={floor.iconColor}>
                                        <use xlinkHref={floor.icon} />
                                    </SvgIcon>
                                </ListItemIcon>

                                <ListItemText primary={floor.label} />

                                <MenuSessionIndicator color={floor.iconColor}
                                                      count={floor.activeSessionCount} />

                            </MenuListItem>
                        );
                    }) }

                </List>

                {debugOptions}

            </div>
        );
    }
}

export default Menu;
