// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Clock from '../app/Clock';
import { PageHeader, PageHeaderDefaults, PageHeaderProps } from '../components/PageHeader';
import { ProgramEvent } from '../app/ProgramEvent';
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
}

/**
 * State of the event schedule page. Details both the header as the content that should be displayed
 * on the page, such as sessions and shifts w/ volunteers.
 */
interface State {
    /**
     * Details required to display the page header.
     */
    header: PageHeaderProps;
}

/**
 * The event schedule page displays more information about an event, the information that's known
 * about it, as well as the sessions and volunteer shifts scheduled at it.
 */
class EventSchedulePage extends React.Component<Properties, State> {
    state: State = {
        header: PageHeaderDefaults,
    }

    /**
     * Called when the component mounts or updates, to compute the state. This will trigger React to
     * request a re-render of the element and the displayed information.
     */
    static getDerivedStateFromProps(props: Properties) {
        const { event } = props;

        const firstSession = event.sessions[0];
        const firstSessionFloor = firstSession.location.floor;

        // Compile the information that's to be displayed in the page header.
        const header: PageHeaderProps = {
            icon: firstSessionFloor.icon || undefined,
            iconColor: firstSessionFloor.iconColor,
            subtitle: getLocationDescription(firstSession.location),
            title: firstSession.name,
        };

        return { header };
    }

    render() {
        const { header } = this.state;

        return (
            <React.Fragment>

                <PageHeader {...header} />

            </React.Fragment>
        );
    }
}

export { EventSchedulePage };
