// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        saveButtonAnim: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
        saveButtonWrapper: {
            margin: theme.spacing(1),
            position: 'relative',
        },
    });

/**
 * Properties accepted by the <UpdateTextDialog>.
 */
interface Properties {
    /**
     * Event handler that will be invoked when the dialog has to close.
     */
    onClose: () => void;

    /**
     * Event handler that will be invoked when the dialog has to close, and the given |text| should
     * be saved as the updated text. Returns whether the operation was successful.
     */
    onSave: (text: string) => Promise<boolean>;

    /**
     * Whether the dialog should be opened.
     */
    open?: boolean;

    /**
     * The text that should be edited, if any.
     */
    text?: string;

    /**
     * Title of the text dialog that should be displayed.
     */
    title: string;
}

/**
 * Internal state maintained by the <UpdateTextDialog>.
 */
interface State {
    /**
     * The text that's been inserted in the dialog's edit component so far.
     */
    currentText: string;

    /**
     * Whether the inserted text is currently being saved.
     */
    textSaving: boolean;

    /**
     * Whether saving the text has failed, which will pop up yet another dialog.
     */
    textSavingFailed: boolean;
}

/**
 * The <UpdateTextDialog> component, when opened, displays a dialog that allows the user to edit a
 * particular text. The dialog has been designed to minimize the probability of data loss.
 */
class UpdateTextDialog extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        currentText: '',
        textSaving: false,
        textSavingFailed: false,
    };

    componentWillMount() {
        this.setState({
            currentText: this.props.text || '',
        });
    }

    componentWillReceiveProps(props: Properties) {
        this.setState({
            currentText: props.text || '',
        });
    }

    /**
     * Called when the text in the input field has been updated. It should amend local state so that
     * the latest value can be displayed, and returned once it's being saved.
     */
    @bind
    updateCurrentText(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            currentText: event.target.value,
        });
    }

    /**
     * Called when the text that's being updated through this component has to be saved.
     */
    @bind
    async saveText() {
        this.setState({ textSaving: true });

        // Wait for the save operation to propagate through the application.
        const result = await this.props.onSave(this.state.currentText);

        if (!result)
            this.setState({ textSavingFailed: true });

        this.setState({ textSaving: false });
    }

    /**
     * Called when the dialog _might_ have to close. The user clicked either outside of the dialog
     * or pressed the <Esc> key. Only allow the close if the content wasn't modified.
     */
    @bind
    maybeClose() {
        // Special-case where both are empty, since those are represented differently.
        if (this.state.currentText === '' && !this.props.text) {
            this.props.onClose();
            return;
        }

        if (this.state.currentText !== this.props.text)
            return;  // their values changed

        this.props.onClose();
    }

    /**
     * Called when the "the text could not be saved" dialog should be closed.
     */
    @bind
    closeFailureDialog() {
        this.setState({
            textSavingFailed: false,
        });
    }

    render() {
        const { classes, onClose, open, title } = this.props;
        const { currentText, textSaving, textSavingFailed } = this.state;

        return (
            <>
                <Dialog fullWidth={true}
                        maxWidth={false}
                        onClose={this.maybeClose}
                        open={!!open}>

                    <DialogTitle>
                        {title}
                    </DialogTitle>

                    <DialogContent>
                        <Divider />

                            <Input onChange={this.updateCurrentText}
                                   autoFocus={true}
                                   fullWidth={true}
                                   multiline={true}
                                   value={currentText} />

                        <Divider />
                    </DialogContent>

                    <DialogActions>

                        <Button disabled={textSaving} onClick={onClose}>
                            Cancel
                        </Button>

                        <div className={classes.saveButtonWrapper}>

                            <Button disabled={textSaving}
                                    color="primary"
                                    onClick={this.saveText}>

                                Save

                            </Button>

                            { textSaving &&
                                <CircularProgress size={24} className={classes.saveButtonAnim} /> }

                        </div>

                    </DialogActions>

                </Dialog>

                <Dialog open={textSavingFailed}
                        onClose={this.closeFailureDialog}>

                    <DialogTitle>
                        Could not save your update
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Something went wrong and the update could not be saved. Please try
                            again later.
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.closeFailureDialog}>
                            Close
                        </Button>
                    </DialogActions>

                </Dialog>

            </>
        );
    }
}

const StyledUpdateTextDialog = withStyles(styles)(UpdateTextDialog);
export { StyledUpdateTextDialog as UpdateTextDialog };
