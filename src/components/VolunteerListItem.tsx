// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import AccessCodeDialogButton from './AccessCodeDialogButton';
import AvatarDialogButton from './AvatarDialogButton';
import ConditionalLink from './ConditionalLink';
import { Volunteer } from '../app/Volunteer';
import slug from '../app/util/Slug';

import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PhoneIcon from '@material-ui/icons/Phone';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        link: {
            textDecoration: 'none',
            color: 'inherit',
        }
    });

/**
 * Work-around for an issue where the `button` property for the <ListItem> component became a
 * discriminant for the component's properties, meaning it can't be set dynamically.
 *
 * @see https://github.com/mui-org/material-ui/pull/15049
 */
function ConditionalListItem(props: { button: boolean, children: React.ReactNode }): JSX.Element {
  const { button, children } = props;

  if (button)
    return <ListItem button>{children}</ListItem>;

  return <ListItem>{children}</ListItem>;
}

/**
 * Properties accepted by the <Volunteer> element.
 */
interface Properties {
    /**
     * The volunteer for whom this element is being rendered.
     */
    volunteer: Volunteer;

    /**
     * Type of list item that should be rendered. The contents of the list item will automatically
     * be compiled based on the |volunteer| property.
     *
     * Supported types:
     *   "header": Displays the volunteer's name and title. Not linked.
     *   "status": Displays the volunteer's name, title and current shift, if any. Linked.
     */
    type: "header" | "status";

    /**
     * An event that is to be invoked if the photo of the |volunteer| has been updated. The ability
     * to change the photo will be enabled based on whether this property has been set.
     */
    onPictureUpdated?: (imageData: string) => Promise<boolean>;
}

/**
 * Element that's responsible for displaying the status of an individual volunteer. The |type|
 * property can be used to influence which subset of information should be presented.
 */
class VolunteerListItem extends React.Component<Properties & WithStyles<typeof styles>> {
    /**
     * Opens the dialer on the device (if any) to make a phone call to this volunteer. Should only
     * be called when the volunteer has a known telephone number.
     */
    @bind
    openDialer() {
        const { volunteer } = this.props;

        if (!volunteer.telephone)
            return;

        // "Redirect" them to the dialer. Mobile behaviour is obvious, desktop browsers do different
        // things. Users with Skype (or similar apps) installed can still make phone calls.
        document.location.href = 'tel:' + volunteer.telephone;
    }

    render() {
        const { classes, onPictureUpdated, type, volunteer } = this.props;

        let location: string | undefined = '/volunteers/' + slug(volunteer.name);

        let primary = volunteer.name;
        let secondary = null;
        let actions = null;

        switch (type) {
            case 'header':
                location = undefined;
                secondary = volunteer.title;
                actions = (
                    <AccessCodeDialogButton volunteer={volunteer}>
                        { volunteer.telephone &&
                              <IconButton onClick={this.openDialer} aria-label="Call this person">
                                  <PhoneIcon />
                              </IconButton> }
                    </AccessCodeDialogButton>
                );
                break;
            case 'status':
                // TODO: Include the volunteer's current shift.
                secondary = volunteer.title;
                break;
            default:
                throw new Error('Invalid type value: ' + type);
        }

        return (
            <ConditionalLink className={classes.link} to={location}>
                <ConditionalListItem button={!!location}>
                    <AvatarDialogButton volunteer={volunteer} onPictureUpdated={onPictureUpdated} />
                    <ListItemText
                        primary={primary}
                        secondary={secondary} />
                    {actions}
                </ConditionalListItem>
            </ConditionalLink>
        );
    }
}

export default withStyles(styles)(VolunteerListItem);
