// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import { ThemeProvider as PortalThemeProvider } from './theme';

function withRoot<P>(Component: React.ComponentType<P>) {
    function WithRoot(props: P) {
        return (
            <ThemeProvider theme={PortalThemeProvider.getTheme()}>
                <CssBaseline />
                <Component {...props} />
            </ThemeProvider>
        );
    }

    return WithRoot;
}

export default withRoot;
