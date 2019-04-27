// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        // TODO: Define the styles for this element.
    });

/**
 * Properties accepted by the <OverviewPage> element.
 */
interface Properties {
    // TODO: Define the properties for this element.
}

class OverviewPage extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        return <b>OverviewPage</b>
    }
}

export default withStyles(styles)(OverviewPage);
