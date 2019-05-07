// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { Volunteer } from '../app/Volunteer';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        clickable: { cursor: 'pointer' },
        invisibleInput: { display: 'none' },

        uploadBackground: {
            borderTop: '1px solid #d0d0d0',
            borderBottom: '1px solid #d0d0d0',
            backgroundColor: theme.palette.divider,

            padding: theme.spacing.unit * 2,
        },

        uploadSheet: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.unit,

            backgroundSize: 'cover',
            backgroundColor: 'white',
            borderRadius: '125px',

            width: '250px',
            height: '250px',
        },

        saveButtonAnim: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
        saveButtonWrapper: {
            margin: theme.spacing.unit,
            position: 'relative',
        },
    });

// Naive algorithm for getting the initials for a particular name: selecting the first and the last
// capital available in the name.
const nameInitials = (name: string) =>
    name.replace(/[^A-Z]/g, '').replace(/^(.).*(.)/g, '$1$2');

/**
 * Properties accepted by the <AvatarDialogButton> element.
 */
interface Properties {
    /**
     * The volunteer for whom this element is being rendered.
     */
    volunteer: Volunteer;

    /**
     * Whether the avatar is editable. A dialog will be shown in case it is.
     */
    editable?: boolean;
}

/**
 * State associated with the element.
 */
interface State {
    /**
     * The selected picture in renderable form, if any.
     */
    selectedPicture?: string;

    /**
     * Whether the upload dialog is being presented to the user.
     */
    uploadDialogOpen: boolean;

    /**
     * Whether the photo upload is currently in progress.
     */
    uploadSaving: boolean;
}

/**
 * Element that will display a volunteer's avatar. If the |editable| flag has been set, the avatar
 * can be clicked on to reveal an image uploader where the image can be changed.
 */
class AvatarDialogButton extends React.Component<Properties & WithStyles<typeof styles>, State> {
    state: State = {
        uploadDialogOpen: true,
        uploadSaving: false,
    };

    /**
     * Opens the avatar upload dialog through which the volunteer can change their icon.
     */
    @bind
    openAvatarUploadDialog() {
        this.setState({
            uploadDialogOpen: true
        });
    }

    /**
     * Called when a photo has been selected in the image picker interface. It should be loaded and
     * be displayed as the background of the picker area.
     */
    handlePhotoSelected(selectedFiles: FileList | null) {
        if (!selectedFiles || !selectedFiles[0]) return;

        const fileReader = new FileReader();
        fileReader.addEventListener('load', _ => {
            if (typeof fileReader.result !== 'string') return;
            this.setState({
                selectedPicture: 'url(' + fileReader.result + ')',
            });
        });

        fileReader.readAsDataURL(selectedFiles[0]);
    }

    /**
     * Cancels the avatar upload dialog. Any in-progress photo selection or upload will be canceled.
     * The user can try again if this resulted in undesirable data loss.
     */
    @bind
    cancelAvatarUploadDialog() {
        this.setState({
            uploadDialogOpen: false
        });
    }

    /**
     * Confirms the avatar upload dialog and stores any changes made while it was opened. It may
     * take a little bit of time before the dialog dismisses.
     */
    @bind
    confirmAvatarUploadDialog() {
        this.setState({ uploadSaving: true });

        // TODO: Actually upload the avatar.

        setTimeout(() => {
            this.setState({
                uploadDialogOpen: false,
                uploadSaving: false,
            });
        }, 2500);
    }

    render() {
        const { classes, editable, volunteer } = this.props;

        // If the avatar is not editable, which will be the common case, bail out early.
        if (!editable) {
            return (
                <Avatar>
                    {nameInitials(volunteer.name)}
                </Avatar>
            );
        }

        return (
            <>
                <Avatar className={classes.clickable} onClick={this.openAvatarUploadDialog}>
                    {nameInitials(volunteer.name)}
                </Avatar>

                <Dialog open={this.state.uploadDialogOpen}
                        onClose={this.cancelAvatarUploadDialog}>

                    <DialogTitle>
                        Update picture
                    </DialogTitle>

                    <DialogContent className={classes.uploadBackground}>
                        <div className={classes.uploadSheet}
                             style={{ backgroundImage: this.state.selectedPicture }}>

                            <input accept="foobar;image/*"
                                   className={classes.invisibleInput}
                                   onChange={e => this.handlePhotoSelected(e.target.files)}
                                   id="icon-button-photo"
                                   type="file" />

                            <label htmlFor="icon-button-photo">
                                <IconButton component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>

                        </div>
                    </DialogContent>

                    <DialogActions>
                        <Button disabled={this.state.uploadSaving}
                                onClick={this.cancelAvatarUploadDialog}>
                            Cancel
                        </Button>

                        <div className={classes.saveButtonWrapper}>

                            <Button disabled={this.state.uploadSaving}
                                    color="primary" autoFocus
                                    onClick={this.confirmAvatarUploadDialog}>
                                Save
                            </Button>

                            { this.state.uploadSaving &&
                                  <CircularProgress size={24} className={classes.saveButtonAnim} /> }

                        </div>
                    </DialogActions>

                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(AvatarDialogButton);
