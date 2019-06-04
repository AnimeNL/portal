// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';
import moment from 'moment';

import Clock from '../app/Clock';
import Event from '../app/Event';
import MenuListItem from './MenuListItem';
import { MenuNotifier } from '../state/MenuNotifier';
import MenuSessionIndicator from './MenuSessionIndicator';
import { UpdateTimeTracker } from './UpdateTimeTracker';
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
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * Setting on whether debug mode should be enabled for this user.
     */
    enableDebug: boolean;

    /**
     * The event for which the menu is being displayed.
     */
    event: Event;
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
    updateTimer?: NodeJS.Timeout;
    state: State = {
        volunteersLabel: 'Volunteers',
        floors: []
    }

    componentWillMount() {
        const { clock, event } = this.props;

        // Determine name to for the Volunteers menu item. If the logged in user only has access to
        // a single group, specialize the display.
        const volunteerGroups = Array.from(event.getVolunteerGroups());
        if (volunteerGroups.length === 1)
            this.setState({ volunteersLabel: volunteerGroups[0].label });

        // Populate the list of floors available for the event. The counter will continue to update
        // as time goes on, to ensure we have up-to-date information.
        this.computeFloorInformation();

        // Observe time changes in the application so that we can update the menu.
        clock.addObserver(this.computeFloorInformation);
    }

    componentWillUnmount() {
        const { clock } = this.props;

        if (this.updateTimer)
            clearTimeout(this.updateTimer);

        clock.removeObserver(this.computeFloorInformation);
    }

    /**
     * Computes the current state regarding the floors available for this event. A re-count will
     * happen for all the sessions to determine the active ones.
     */
    @bind
    private computeFloorInformation(): void {
        const { clock, event } = this.props;

        const currentTime = clock.getMoment();
        const floors: FloorDisplayInfo[] = [];

        if (this.updateTimer)
            clearTimeout(this.updateTimer);

        let nextUpdate = currentTime.clone().add({ years: 1 });

        for (const floor of event.getFloors()) {
            if (!floor.icon || !floor.iconColor)
                continue;

            let activeSessionCount = 0;

            for (const location of floor.locations) {
                for (const session of location.sessions) {
                    if (session.endTime < currentTime)
                        continue;

                    if (session.beginTime <= currentTime) {
                        nextUpdate = moment.min(nextUpdate, session.endTime);
                        activeSessionCount++;
                    } else {
                        nextUpdate = moment.min(nextUpdate, session.beginTime);
                    }
                }
            }

            floors.push({
                id: floor.id,
                link: '/schedule/floors/' + floor.id + '/' + slug(floor.label),
                label: floor.label,
                icon: floor.icon,
                iconColor: floor.iconColor,
                activeSessionCount
            });
        }

        this.updateTimer = setTimeout(this.computeFloorInformation, nextUpdate.diff(currentTime));
        this.setState({ floors });
    }

    /**
     * Called when the global page menu should be closed. Only applicable to small screens.
     */
    @bind
    closeMenu() {
        MenuNotifier.notify(/* open= */ false);
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

                        <MenuListItem to="/internals" onClick={this.closeMenu}>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Internals" />
                        </MenuListItem>

                    </List>

                    <UpdateTimeTracker output clock={this.props.clock} />

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

                    <MenuListItem to="/" exact onClick={this.closeMenu}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Overview" />
                    </MenuListItem>

                    { volunteerScheduleLink &&
                        <MenuListItem to={volunteerScheduleLink} exact onClick={this.closeMenu}>
                            <ListItemIcon>
                                <ScheduleIcon />
                            </ListItemIcon>
                            <ListItemText primary="My schedule" />
                        </MenuListItem>
                    }

                </List>

                <Divider />

                <List>

                    <MenuListItem to="/volunteers" exact onClick={this.closeMenu}>
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
                                onClick={this.closeMenu}>

                                <ListItemIcon>
                                    <SvgIcon htmlColor={floor.iconColor}>
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
