// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import indigo from '@material-ui/core/colors/indigo';

// Boolean to indicate whether the current build environment is production or development. API calls
// will be incepted and mocked out for development.
const isProduction = process.env.NODE_ENV === 'production';

// Path to the environment configuration file, relative to the server root.
export const EnvironmentConfigPath = '/api/environment';

// Path to the service that enables users to log in. Their details will be send here in a POST
// request, and a JSON response is expected.
export const UserLoginPath = '/api/login';

// Documentation: https://material-ui.com/customization/themes/
export const AppTheme = {
    palette: {
        primary: indigo,
    },
    typography: {
        useNextVariants: true,
    },
};

// Proxy to the fetch() function that can be mocked when in development. This is done because the
// WebpackDevServer included with react-scripts cannot handle POST requests, which we require for
// logging in to the application.
export async function mockableFetch(path : string, ...args : any) : Promise<Response> {
    if (!isProduction) {
        switch (path) {
            case EnvironmentConfigPath:
                return new Response(`{ "seniorTitle": "Senior Steward", "year": 2019 }`);

            case UserLoginPath:
                return new Response(`{ "success": false }`);

            // no default
        }
    }

    return fetch(path, ...args);
}
