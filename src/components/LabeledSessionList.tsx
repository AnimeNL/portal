// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        // ...
    });

/**
 * Properties accepted by the <LabeledSessionList> component.
 */
interface Properties {
    /**
     * Label that's to be displayed above the list of sessions.
     */
    label: string;
}

/**
 * Represents a labeled list of sessions. The label will be displayed separate from the sheet.
 */
class LabeledSessionList extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { children, classes, label } = this.props;

        return (
            <React.Fragment>
                <h1>{label}</h1>

                <Paper square>
                    <List>
                        {children}
                    </List>
                </Paper>
            </React.Fragment>
        );
    }
}

const StyledLabeledSessionList = withStyles(styles)(LabeledSessionList);
export { StyledLabeledSessionList as LabeledSessionList };
