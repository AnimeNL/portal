// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Environment from '../Environment';
import User from '../User';

import LoginView from '../../views/LoginView';

interface Properties {
    // The environment object relevant for displaying the login screen.
    environment: Environment;

    // The user object can be used to validate authentication information, and persist the local
    // state necessary to actually log a user in.
    user: User;
};

// The login controller is responsible for enabling a user to identify themselves and login to the
// volunteer portal. It's driven by the LoginView for providing input and events.
class LoginController extends React.Component<Properties> {
    async onLogin(email: string, accessCode: number): Promise<boolean> {

        // TODO: Actually log in with the available user object.
        await new Promise(resolve => {
            setTimeout(resolve, 2000);
        });

        return false;
    }

    render() {
        return <LoginView onLogin={this.onLogin}
                          seniorTitle={this.props.environment.seniorTitle!} />;
    }
}

export default LoginController;
