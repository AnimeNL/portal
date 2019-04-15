// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { AppTheme } from './config';

const theme = createMuiTheme(AppTheme);

function withRoot<P>(Component: React.ComponentType<P>) {
    function WithRoot(props: P) {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...props} />
            </MuiThemeProvider>
        );
    }

    return WithRoot;
}

export default withRoot;
