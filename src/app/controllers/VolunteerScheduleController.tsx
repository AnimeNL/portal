// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import bind from 'bind-decorator';

import ApplicationProperties from '../ApplicationProperties';
import NotFound from '../../views/NotFound';
import { UploadPath, mockableFetch } from '../../config';
import { Volunteer } from '../Volunteer';
import { VolunteerSchedulePage } from '../../views/VolunteerSchedulePage';
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
            return;
        }

        this.setState({ volunteer: undefined });
    }

    /**
     * Called when the picture for this volunteer has been updated with the given |imageData|,
     * which is a base64-encoded string (including header) of the new photo.
     */
    @bind
    async onPictureUpdated(imageData: string): Promise<boolean> {
        if (!this.state.volunteer)
            return false;

        const { user } = this.props;
        const { volunteer } = this.state;

        try {
            const requestBody = new FormData();
            requestBody.append('authToken', user.authToken);
            requestBody.append('type', 'update-avatar');

            requestBody.append('targetUserAvatar', imageData);
            requestBody.append('targetUserToken', volunteer.userToken);

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

            if (!data.success || !data.avatar) {
                console.error('The upload response failed for some reason.', data);
                return false;
            }

            this.state.volunteer.info.avatar = data.avatar;
            return true;

        } catch (e) {
            console.error('Unable to handle the upload request.', e);
            return false;
        }

        // not-reached
        return false;
    }

    render() {
        const { event, user } = this.props;
        const { volunteer } = this.state;

        // |volunteer| won't be set if an invalid slug was passed on the URL, so display an error
        // page instead when that's the case.
        if (!volunteer)
            return <NotFound />;

        // Picture upload is enabled for users who can manipulate all avatars, as well as for users
        // looking at their own profile if this feature has been enabled.
        const enablePictureUpload = user.hasAbility('update-avatar-all') ||
                                   (user.hasAbility('update-avatar-self') &&
                                        volunteer === event.getCurrentVolunteer());

        const onPictureUpdated = enablePictureUpload ? this.onPictureUpdated
                                                     : undefined;

        return (
            <VolunteerSchedulePage onPictureUpdated={onPictureUpdated}
                                   volunteer={volunteer} />
        );
    }
}

export default VolunteerScheduleController;
