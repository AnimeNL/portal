// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ApplicationProperties from '../ApplicationProperties';
import { Floor } from '../Floor';
import { FloorSchedulePage } from '../../views/FloorSchedulePage';
import NotFound from '../../views/NotFound';

/**
 * Properties available to the controller through the router.
 */
interface RouterProperties {
    /**
     * Identifier of the floor for which locations should be displayed.
     */
    floor: string;
}

type Properties = ApplicationProperties & RouteComponentProps<RouterProperties>;

/**
 * State of the <FloorScheduleController> element.
 */
interface State {
    /**
     * The floor that has been selected through the identifier included in the URL. It can be unset
     * in case an invalid identifier has been passed instead.
     */
    floor?: Floor;
}

/**
 * The FloorScheduleController is responsible for displaying an alphabetized list of locations on
 * the given floor together with the active or near-future events taking place in them.
 */
class FloorScheduleController extends React.Component<Properties, State> {
    state: State = {}

    componentWillMount(): void {
        this.updateFloorFromIdentifier(this.props.match.params.floor);
    }

    componentWillReceiveProps(nextProps: Properties): void {
        this.updateFloorFromIdentifier(nextProps.match.params.floor);
    }

    /**
     * Update the floor which is being displayed given the |identifier|.
     */
    private updateFloorFromIdentifier(identifier: string): void {
        const { event } = this.props;
        const floorId = parseInt(identifier);

        for (const floor of event.getFloors()) {
            if (floor.id !== floorId)
                continue;

            this.setState({ floor });
            return;
        }

        this.setState({ floor: undefined });
    }

    render() {
        const { clock } = this.props;
        const { floor } = this.state;

        // |floor| won't be set if an invalid identifier was passed on the URL, so display an error
        // page instead when that's the case.
        if (!floor)
            return <NotFound />;

        return <FloorSchedulePage clock={clock} floor={floor} />;
    }
}

export default FloorScheduleController;
