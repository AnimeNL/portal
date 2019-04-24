// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Clock from '../Clock';
import Environment from '../Environment';
import User from '../User';

import PortalView from '../../views/PortalView';

/**
 * Properties that must be passed to the <PortalController>. Interaction with these elements will be
 * provided through events made available on the <PortalView> element.
 */
interface Properties {
    clock: Clock;
    environment: Environment;
    user: User;
};

/**
 * The <PortalController> is the main application runtime for logged in users.
 */
class PortalController extends React.Component<Properties> {
    render() {
        return <PortalView />;
    }
}

export default PortalController;
