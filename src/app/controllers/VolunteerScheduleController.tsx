// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import bind from 'bind-decorator';

import ApplicationProperties from '../ApplicationProperties';
import NotFound from '../../views/NotFound';
import { Volunteer } from '../Volunteer';
import createSlug from '../util/Slug';

/**
 * Properties available to the controller through the router.
 */
interface RouterProperties {
    /**
     * Slug of the volunteer's name that's been included in the URL.
     */
    slug: string;
}

type Properties = ApplicationProperties & RouteComponentProps<RouterProperties>;

/**
 * State of the <VolunteerScheduleController> element.
 */
interface State {
    /**
     * The volunteer for whom the schedule should be rendered, if they could be identified based on
     * the slug of their name in the URL.
     */
    volunteer?: Volunteer;
}

/**
 * The VolunteerScheduleController displays the schedule of a particular volunteer, as well as
 * basic information about the volunteer such as their avatar, name, title and personal information
 * if the logged in user has access to that.
 */
class VolunteerScheduleController extends React.Component<Properties, State> {
    state: State = {}

    componentWillMount(): void {
        this.updateVolunteerFromSlug(this.props.match.params.slug);
    }

    componentWillReceiveProps(nextProps: Properties): void {
        this.updateVolunteerFromSlug(nextProps.match.params.slug);
    }

    /**
     * Update the volunteer for whom the schedule is being displayed based on the given |slug|.
     *
     * @param slug The slug of the volunteer's name as made available through the URL.
     */
    private updateVolunteerFromSlug(slug: string): void {
        const { event } = this.props;

        for (const volunteer of event.getVolunteers()) {
            if (createSlug(volunteer.name) !== slug)
                continue;

            this.setState({ volunteer });
            break;
        }
    }

    render() {
        const { volunteer } = this.state;

        // |volunteer| won't be set if an invalid slug was passed on the URL, so display an error
        // page instead when that's the case.
        if (!volunteer)
            return <NotFound />;

        return <b>{volunteer.name}</b>;
    }
}

export default VolunteerScheduleController;
