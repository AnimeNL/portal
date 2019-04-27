// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ApplicationProperties from '../ApplicationProperties';
import InternalsPage from '../../views/InternalsPage';

/**
 * The InternalsController is responsible for enabling users with debugging capabilities to change
 * internal state of the application. An example of this is the current time, which makes it
 * possible to observe the state of the application at any given point in the future.
 */
class InternalsController extends React.Component<ApplicationProperties> {
    render() {
        return <InternalsPage />;
    }
}

export default InternalsController;
