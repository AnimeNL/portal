// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { Volunteer } from '../app/Volunteer';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import LockIcon from '@material-ui/icons/Lock';
import Snackbar from '@material-ui/core/Snackbar';

/**
 * Properties accepted by the <AccessCodeDialogButton> element.
 */
interface Properties {
    /**
     * The volunteer for whom this element is being rendered.
     */
    volunteer: Volunteer;
}

/**
 * State of the <AccessCodeDialogButton> element, primarily meant for keeping track on whether the
 * dialog displaying the access code should be visible.
 */
interface State {
    /**
     * Whether the dialog is currently being displayed to the viewer.
     */
    dialogOpen: boolean;

    /**
     * Whether the copy confirmation snackbar is currently being displayed to the viewer.
     */
    snackbarOpen: boolean;
}

/**
 * Element that will display a lock icon when the access code for the |volunteer| can be accessed.
 * Clicking on the icon will open a prompt displaying the volunteer's access code.
 */
class AccessCodeDialogButton extends React.Component<Properties, State> {
    state: State = {
        dialogOpen: false,
        snackbarOpen: false,
    };

    /**
     * Copies the access code to the viewer's clipboard, and displays a confirmation snackbar to
     * let them know this actually happened as a means of feedback.
     */
    @bind
    async copyToClipboard() {
        const { volunteer } = this.props;

        await navigator.clipboard.writeText(volunteer.accessCode!);
        this.setState({ snackbarOpen: true });
    }

    /**
     * Opens the dialog that will display the volunteer's access code.
     */
    @bind
    openDialog() {
        this.setState({ dialogOpen: true });
    }

    /**
     * Closes the snackbar that confirms the access code was copied to the viewer's clipboard.
     */
    @bind
    closeConfirmationSnackbar() {
        this.setState({ snackbarOpen: false });
    }

    /**
     * Closes the dialog that was showing the volunteer's access code.
     */
    @bind
    closeDialog() {
        this.setState({ dialogOpen: false });
    }

    render() {
        const { volunteer } = this.props;
        if (!volunteer.accessCode)
            return <></>;

        // TODO: Maybe support copying the access code with traditional DOM-based methods as well?
        const supportsCopyToClipboard = navigator.clipboard && navigator.clipboard.writeText;

        return (
            <>
                <ListItemSecondaryAction>
                    <IconButton onClick={this.openDialog} aria-label="Display access code">
                        <LockIcon />
                    </IconButton>
                </ListItemSecondaryAction>

                <Dialog open={this.state.dialogOpen} onClose={this.closeDialog}>
                    <DialogTitle>
                        Display access code
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The access code of {volunteer.name} is <strong>{volunteer.accessCode}</strong>.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        { supportsCopyToClipboard &&
                          <Button onClick={this.copyToClipboard} color="primary">
                              Copy
                          </Button> }
                        <Button onClick={this.closeDialog} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    autoHideDuration={2000}
                    open={this.state.snackbarOpen}
                    onClose={this.closeConfirmationSnackbar}
                    message="Copied to clipboard" />
            </>
        );
    }
}

export default AccessCodeDialogButton;
