// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ApplicationProperties from '../ApplicationProperties';
import OverviewPage from '../../views/OverviewPage';

/**
 * The OverviewController is responsible for displaying the overview page, that gives a summary of
 * the logged in user, their shifts and additional notifications.
 */
class OverviewController extends React.Component<ApplicationProperties> {
    render() {
        return <OverviewPage />;
    }
}

export default OverviewController;
