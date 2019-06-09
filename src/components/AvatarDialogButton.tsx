// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import { Volunteer } from '../app/Volunteer';
import { nameInitials } from '../app/util/nameInitials';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
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

            padding: theme.spacing(2),
        },

        uploadSheet: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(1),

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
            margin: theme.spacing(1),
            position: 'relative',
        },
    });

/**
 * Properties accepted by the <AvatarDialogButton> element.
 */
interface Properties {
    /**
     * The volunteer for whom this element is being rendered.
     */
    volunteer: Volunteer;

    /**
     * An event that is to be invoked if the photo of the |volunteer| has been updated. The ability
     * to change the photo will be enabled based on whether this property has been set.
     */
    onPictureUpdated?: (imageData: string) => Promise<boolean>;
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
        uploadDialogOpen: false,
        uploadSaving: false,
    };

    /**
     * Opens the avatar upload dialog through which the volunteer can change their icon.
     */
    @bind
    openAvatarUploadDialog() {
        const { volunteer } = this.props;

        this.setState({
            uploadDialogOpen: true,
            selectedPicture: volunteer.avatar,
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
                selectedPicture: fileReader.result,
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
    async confirmAvatarUploadDialog() {
        const { selectedPicture } = this.state;
        const { onPictureUpdated } = this.props;

        // The |onPictureUpdated| event must be set in order for uploading photos to be enabled. A
        // picture has to be selected in order to upload anything at all.
        if (!onPictureUpdated || !selectedPicture) {
            this.cancelAvatarUploadDialog();
            return;
        }

        this.setState({ uploadSaving: true });

        await onPictureUpdated(selectedPicture);
        // TODO: Handle |result|==false

        this.setState({
            uploadDialogOpen: false,
            uploadSaving: false,
        });
    }

    render() {
        const { classes, onPictureUpdated, volunteer } = this.props;

        // If the |onPictureUpdated| event has not been set, bail out. This is the common case since
        // the ability to upload new photos is limited to the current user and admins.
        if (!onPictureUpdated) {
            return (
                <ListItemAvatar>
                    <Avatar src={volunteer.avatar}>
                        {nameInitials(volunteer.name)}
                    </Avatar>
                </ListItemAvatar>
            );
        }

        const selectedAvatar =
            this.state.selectedPicture ? 'url(' + this.state.selectedPicture + ')'
                                       : undefined;

        return (
            <>
                <ListItemAvatar>
                    <Avatar src={volunteer.avatar}
                            className={classes.clickable}
                            onClick={this.openAvatarUploadDialog}>
                        {nameInitials(volunteer.name)}
                    </Avatar>
                </ListItemAvatar>

                <Dialog open={this.state.uploadDialogOpen}
                        onClose={this.cancelAvatarUploadDialog}>

                    <DialogContent className={classes.uploadBackground}>
                        <div className={classes.uploadSheet}
                             style={{ backgroundImage: selectedAvatar }}>

                            <input accept="image/*"
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
