// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Ability } from '../../abilities';
import ApplicationProperties from '../ApplicationProperties';
import { EventSchedulePage } from '../../views/EventSchedulePage';
import { ProgramEvent } from '../ProgramEvent';
import NotFound from '../../views/NotFound';

/**
 * Properties available to the controller through the router.
 */
interface RouterProperties {
    /**
     * Identifier of the event for which the sessions and shifts should be displayed.
     */
    event: string;
}

type Properties = ApplicationProperties & RouteComponentProps<RouterProperties>;

/**
 * State of the <EventScheduleController> element.
 */
interface State {
    /**
     * The event that has been identified through parameters in the URL.
     */
    event?: ProgramEvent;
}

/**
 * The EventScheduleController is responsible for display details about an individual event and the
 * sessions therein.
 */
class EventScheduleController extends React.Component<Properties, State> {
    state: State = {}

    /**
     * Called when the properties for this element are set. Identifies the location that has to be
     * displayed, if any.
     */
    static getDerivedStateFromProps(props: Properties) {
        const { event, setTitle } = props;
        const eventId = parseInt(props.match.params.event);

        const programEvent = event.getEvent(eventId);

        setTitle(programEvent ? programEvent.sessions[0].name
                              : null);

        return { event: programEvent };
    }

    render() {
        const { clock, user } = this.props;
        const { event } = this.state;

        // |event| won't be set if an invalid identifier was passed on the URL, so display an
        // error page instead when that's the case.
        if (!event)
            return <NotFound />;

        return <EventSchedulePage clock={clock} event={event}
                                  mutable={user.hasAbility(Ability.ManageEventInfo)} />
    }
}

export default EventScheduleController;
