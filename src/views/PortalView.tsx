// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import { Header, HeaderEvents } from '../components/Header';
import withRoot from '../withRoot';

import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = () =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    });

/**
 * Properties given to the PortalView element. These are required for the portal to be able to
 * effectively route user interaction to the appropriate place, and provide access to the app model.
 */
interface Properties extends HeaderEvents, WithStyles<typeof styles> {
    // TODO: Define the properties for the PortalView
}

/**
 * Dynamic state of the portal view that can change as the user navigates between pages. Each state
 * update at this level may cause parts of the DOM to be re-rendered.
 */
interface State {
    /**
     * Title that should be displayed in the header bar.
     */
    title: string;
}

/**
 * Main layout of the portal that will be presented to logged in users. The view contains three
 * primary components: the header bar, the left-hand side menu and contents of the current page. The
 * application router is rendered as part of this view as well.
 */
class PortalView extends React.Component<Properties, State> {
    state: State = {
        title: 'Volunteer Portal',
    };

    render() {
        const { classes, onLogout, onRefresh } = this.props;

        return (
            <div className={classes.root}>
                <Header title={this.state.title}
                        onLogout={onLogout}
                        onRefresh={onRefresh} />
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(PortalView));
