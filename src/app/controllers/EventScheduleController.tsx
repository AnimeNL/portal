// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import bind from 'bind-decorator';

import { Ability } from '../../abilities';
import ApplicationProperties from '../ApplicationProperties';
import { EventSchedulePage } from '../../views/EventSchedulePage';
import NotFound from '../../views/NotFound';
import { ProgramEvent } from '../ProgramEvent';
import { TitleManager } from '../../title';
import { UploadPath, mockableFetch } from '../../config';

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
        const { event } = props;
        const eventId = parseInt(props.match.params.event);

        const programEvent = event.getEvent(eventId);

        TitleManager.setTitle(programEvent ? programEvent.sessions[0].name
                                           : null);

        return { event: programEvent };
    }

    /**
     * Update the notes for the current event to |notes|. Will return a promise that settles when
     * the result of the operation is known. Asynchronous.
     */
    @bind
    async updateDescription(notes: string): Promise<boolean> {
        const { user } = this.props;

        const programEvent = this.state.event;
        if (!programEvent || !user.hasAbility(Ability.ManageEventInfo))
            return false;

        try {
            const requestBody = new FormData();
            requestBody.append('authToken', user.authToken);
            requestBody.append('type', 'update-event');

            requestBody.append('eventId', programEvent.id.toString());
            requestBody.append('notes', notes);

            const response = await mockableFetch(UploadPath, {
                method: 'POST',
                body: requestBody
            });

            if (!response.ok) {
                console.error('Unable to fulfil the upload request.')
                return false;
            }

            const data = JSON.parse(await response.text());
            if (!data) {
                console.error('Unable to parse the upload response.');
                return false;
            }

            if (!data.success) {
                console.error('The upload response failed for some reason.', data);
                return false;
            }

            programEvent.setNotes(data.notes);

            // Trigger a state update to make sure we re-render the latest changes.
            this.setState({ event: this.state.event });

            return true;

        } catch (e) {
            console.error('Unable to handle the upload request.', e);
            return false;
        }
    }

    render() {
        const { clock, user } = this.props;
        const { event } = this.state;

        // |event| won't be set if an invalid identifier was passed on the URL, so display an
        // error page instead when that's the case.
        if (!event)
            return <NotFound />;

        return <EventSchedulePage clock={clock} event={event}
                                  mutable={user.hasAbility(Ability.ManageEventInfo)}
                                  onDescriptionChange={this.updateDescription} />
    }
}

export default EventScheduleController;
