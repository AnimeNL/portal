// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import Environment from '../Environment';
import User from '../User';

import LoginView from '../../views/LoginView';

interface Properties {
    /**
     * The environment object relevant for displaying the login screen.
     */
    environment: Environment;

    /**
     * The user object can be used to validate authentication information, and persist the local
     * state necessary to actually log a user in.
     */
    user: User;
};

/**
 * The login controller is responsible for enabling a user to identify themselves and login to the
 * volunteer portal. It's driven by the LoginView for providing input and events.
 */
class LoginController extends React.Component<Properties> {
    /**
     * Called when the form included on the login view has been submitted.
     *
     * @param email The e-mail address entered by the user.
     * @param accessCode The access code entered by the user.
     * @return A promise that will be resolved with a boolean once the login state is known.
     */
    @bind
    async onLogin(email: string, accessCode: string): Promise<boolean> {
        return this.props.user.login(email, accessCode);
    }

    render() {
        return <LoginView onLogin={this.onLogin}
                          seniorTitle={this.props.environment.seniorTitle!} />;
    }
}

export default LoginController;
