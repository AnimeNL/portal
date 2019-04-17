// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import indigo from '@material-ui/core/colors/indigo';

const root = process.env.PUBLIC_URL;
const directory = process.env.BACKEND_DIR || 'backend';

// Path to the environment configuration file, relative to the server root.
export const EnvironmentConfigPath = `${root}/${directory}/environment.json`;

// Path to the service that enables users to log in. Their details will be send
// here in a POST request, and a JSON response is expected.
export const UserLoginPath = `${root}/${directory}/login.json`;

// Documentation: https://material-ui.com/customization/themes/
export const AppTheme = {
    palette: {
        primary: indigo,
    },
    typography: {
        useNextVariants: true,
    },
};
