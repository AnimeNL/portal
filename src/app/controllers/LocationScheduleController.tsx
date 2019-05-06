// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ApplicationProperties from '../ApplicationProperties';
import { Location } from '../Location';
import NotFound from '../../views/NotFound';

/**
 * Properties available to the controller through the router.
 */
interface RouterProperties {
    /**
     * Identifier of the location for which events should be displayed.
     */
    location: string;
}

type Properties = ApplicationProperties & RouteComponentProps<RouterProperties>;

/**
 * State of the <LocationScheduleController> element.
 */
interface State {
    /**
     * The location that has been identified through parameters in the URL.
     */
    location?: Location;
}

/**
 * The LocationScheduleController is responsible for displaying the events that will take place
 * in a particular, identified location.
 */
class LocationScheduleController extends React.Component<Properties, State> {
    state: State = {}

    componentWillMount(): void {
        this.updateLocationFromIdentifier(this.props.match.params.location);
    }

    componentWillReceiveProps(nextProps: Properties): void {
        this.updateLocationFromIdentifier(nextProps.match.params.location);
    }

    /**
     * Update the location which is being displayed given the |identifier|.
     */
    private updateLocationFromIdentifier(identifier: string): void {
        const { event } = this.props;
        const locationId = parseInt(identifier);

        for (const location of event.getLocations()) {
            if (location.id !== locationId)
                continue;

            this.setState({ location });
            return;
        }

        this.setState({ location: undefined });
    }

    render() {
        const { location } = this.state;

        // |location| won't be set if an invalid identifier was passed on the URL, so display an
        // error page instead when that's the case.
        if (!location)
            return <NotFound />;

        return (
            <b>{location.label}</b>
        );
    }
}

export default LocationScheduleController;
