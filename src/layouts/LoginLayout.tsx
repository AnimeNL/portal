// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from '../withRoot';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            textAlign: 'center',
            paddingTop: theme.spacing.unit * 20,
        },
    });

type State = {
    open: boolean;
};

class LoginLayout extends React.Component<WithStyles<typeof styles>, State> {
    render() {
        return (
            <Button color="primary">Hello</Button>
        )
    }
}

export default withRoot(withStyles(styles)(LoginLayout));
