// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Clock from '../app/Clock';
import { LabeledSessionList } from '../components/LabeledSessionList';
import { ExpandableDescriptionPaper } from '../components/ExpandableDescriptionPaper';
import { PageHeader, PageHeaderDefaults, PageHeaderProps } from '../components/PageHeader';
import { ProgramEvent } from '../app/ProgramEvent';
import { SessionListItem, SessionListItemProps } from '../components/SessionListItem';
import { getLocationDescription } from '../app/util/getDescription';

/**
 * Properties accepted by the <EventSchedulePage> component.
 */
interface Properties {
    /**
     * Clock used to determine the active and upcoming sessions for this page.
     */
    clock: Clock;

    /**
     * The event for which this page is being rendered.
     */
    event: ProgramEvent;

    /**
     * Whether the user is able to change the description of this event.
     */
    mutable?: boolean;
}

/**
 * SessionListItemProps, with a `key` field to ensure uniqueness in the list.
 */
type SessionDisplayInfo = SessionListItemProps & { key: string };

/**
 * State of the event schedule page. Details both the header as the content that should be displayed
 * on the page, such as sessions and shifts w/ volunteers.
 */
interface State {
    /**
     * Description of the event, if there is one available.
     */
    description?: string;

    /**
     * Details required to display the page header.
     */
    header: PageHeaderProps;

    /**
     * List of sessions that will be hosted as part of this event.
     */
    sessions: SessionDisplayInfo[];
}

/**
 * The event schedule page displays more information about an event, the information that's known
 * about it, as well as the sessions and volunteer shifts scheduled at it.
 */
class EventSchedulePage extends React.Component<Properties, State> {
    state: State = {
        header: PageHeaderDefaults,
        sessions: [],
    }

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        const { event } = props;

        const firstSession = event.sessions[0];
        const firstSessionFloor = firstSession.location.floor;

        // (1) Compile the information that's to be displayed in the page header.
        const header: PageHeaderProps = {
            icon: firstSessionFloor.icon || undefined,
            iconColor: firstSessionFloor.iconColor,
            subtitle: getLocationDescription(firstSession.location),
            title: firstSession.name,
        };

        // (2) If a description is available for this session, set it to the state.
        const description = firstSession.description || undefined;

        // (2) Compile the list of sessions that are part of this event.
        const sessions: SessionDisplayInfo[] = [];
        event.sessions.forEach((session, index) => {
            sessions.push({
                beginTime: session.beginTime,
                endTime: session.endTime,
                key: index.toString()
            });
        });

        // TODO: Be able to list an admin-provided description for this session.
        // TODO: List volunteer shifts on this page.

        return { description, header, sessions };
    }

    render() {
        const { description, header, sessions } = this.state;

        return (
            <React.Fragment>

                <PageHeader {...header} />

                { description &&
                    <ExpandableDescriptionPaper title="Event description">
                        {description}
                    </ExpandableDescriptionPaper> }

                <LabeledSessionList dense label="Sessions">
                    { sessions.map(session => <SessionListItem {...session} /> ) }
                </LabeledSessionList>

            </React.Fragment>
        );
    }
}

export { EventSchedulePage };
