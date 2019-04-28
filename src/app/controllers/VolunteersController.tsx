// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ApplicationProperties from '../ApplicationProperties';
import VolunteerListPage from '../../views/VolunteerListPage';

/**
 * The VolunteersController is responsible for displaying the different groups of volunteers, and
 * providing access to their position, current status and detailed schedule.
 *
 * TODO: Handle /volunteers/schedule as a redirect to the user's own schedule.
 */
class VolunteersController extends React.Component<ApplicationProperties> {
    render() {
        return <VolunteerListPage />;
    }
}

export default VolunteersController;
