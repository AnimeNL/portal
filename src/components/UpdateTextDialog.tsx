// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
    });

/**
 * Properties accepted by the <UpdateTextDialog>.
 */
interface Properties {
    /**
     * Whether the dialog should be opened.
     */
    open?: boolean;

    /**
     * The text that should be edited, if any.
     */
    text?: string;
}

/**
 * Internal state maintained by the <UpdateTextDialog>.
 */
interface State {

}

/**
 * The <UpdateTextDialog> component, when opened, displays a dialog that allows the user to edit a
 * particular text. The dialog has been designed to minimize the probability of data loss.
 */
class UpdateTextDialog extends React.Component<Properties & WithStyles<typeof styles>, State> {
    render() {
        return null;
    }
}

const StyledUpdateTextDialog = withStyles(styles)(UpdateTextDialog);
export { StyledUpdateTextDialog as UpdateTextDialog };
