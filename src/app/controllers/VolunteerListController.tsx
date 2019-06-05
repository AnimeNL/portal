// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import ApplicationProperties from '../ApplicationProperties';
import { TitleManager } from '../../state/TitleManager';
import { VolunteerListPage } from '../../views/VolunteerListPage';
import { Volunteer } from '../Volunteer';
import { VolunteerGroup } from '../VolunteerGroup';

/**
 * State of the VolunteerListController.
 */
interface State {
    activeGroupIndex: number;
    groups: VolunteerGroup[];
    volunteers: Volunteer[];
}

/**
 * The VolunteerListController is responsible for displaying the different groups of volunteers, and
 * providing access to their position, current status and detailed schedule.
 */
class VolunteerListController extends React.Component<ApplicationProperties, State> {
    state: State = {
        activeGroupIndex: 0,
        groups: [],
        volunteers: []
    }

    /**
     * Called when the component is about to mount. Compute the list of groups and volunteers that
     * should be displayed on these pages, and set that as state.
     */
    componentWillMount(): void {
        const { event } = this.props;
        const state: State = this.state;

        for (const activityInfo of event.getVolunteerGroups()) {
            const group = activityInfo.group;

            if (group.primary) {
                state.activeGroupIndex = state.groups.length;
                state.volunteers = this.getVolunteersForGroup(group);
            }

            state.groups.push(group);
        }

        TitleManager.notify('Volunteers');

        this.setState(state);
    }

    /**
     * Returns the list of volunteers for the given |group| as an array.
     */
    private getVolunteersForGroup(group: VolunteerGroup): Volunteer[] {
        return Array.from(this.props.event.getVolunteersForGroup(group)).map(e => e.volunteer);
    }

    /**
     * Called when the list of volunteers that's being presented should change, usually in response
     * to the user clicking on a tab. The |groupIndex| identifies the index of the target group.
     */
    @bind
    onVolunteerGroupChange(groupIndex: number): void {
        const group = this.state.groups[groupIndex];

        this.setState({
            activeGroupIndex: groupIndex,
            volunteers: this.getVolunteersForGroup(group)
        });
    }

    render() {
        return (<VolunteerListPage activeGroupIndex={this.state.activeGroupIndex}
                                   groups={this.state.groups}
                                   volunteers={this.state.volunteers}
                                   onVolunteerGroupChange={this.onVolunteerGroupChange} />);
    }
}

export default VolunteerListController;
