// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import ApplicationProperties from '../ApplicationProperties';
import { VolunteerDisplayInfo, VolunteerGroupDisplayInfo, VolunteerListPage } from '../../views/VolunteerListPage';

/**
 * State of the VolunteerListController.
 */
interface State {
    activeGroupIndex: number;
    groups: VolunteerGroupDisplayInfo[];
    volunteers: VolunteerDisplayInfo[];
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
        const initialState: State = {
            activeGroupIndex: 0,
            groups: [],
            volunteers: []
        };

        for (const group of event.getVolunteerGroups()) {
            if (group.primary)
                initialState.activeGroupIndex = initialState.groups.length;

            initialState.groups.push({
                label: group.label,
                activeVolunteers: 0
            });
        }

        this.setState(initialState);
    }

    /**
     * Called when the list of volunteers that's being presented should change, usually in response
     * to the user clicking on a tab. The |groupIndex| identifies the index of the target group.
     */
    @bind
    onVolunteerGroupChange(groupIndex: number): void {
        this.setState({
            activeGroupIndex: groupIndex
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
