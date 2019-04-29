// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Link } from 'react-router-dom';
import React from 'react';

import { Volunteer } from '../app/Volunteer';
import slug from '../app/util/Slug';

import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

// Naive algorithm for getting the initials for a particular name: selecting the first and the last
// capital available in the name.
const nameInitials = (name: string) =>
    name.replace(/[^A-Z]/g, '').replace(/^(.).*(.)/g, '$1$2');

const styles = (theme: Theme) =>
    createStyles({
        link: {
            textDecoration: 'none',
            color: 'inherit',
        }
    });

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
     *   "status": Displays the volunteer's name, title and current shift, if any.
     */
    type: "status";
}

/**
 * Element that's responsible for displaying the status of an individual volunteer. The |type|
 * property can be used to influence which subset of information should be presented.
 */
class VolunteerListItem extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes, type, volunteer } = this.props;

        const location = '/volunteers/' + slug(volunteer.name);

        let primary = volunteer.name;
        let secondary = null;

        switch (type) {
            case 'status':
                secondary = volunteer.title;
                break;
            default:
                throw new Error('Invalid type value: ' + type);
        }

        return (
            <Link className={classes.link} to={location}>
                <ListItem button>
                    <Avatar>
                        {nameInitials(volunteer.name)}
                    </Avatar>
                    <ListItemText
                        primary={primary}
                        secondary={secondary} />
                </ListItem>
            </Link >
        );
    }
}

export default withStyles(styles)(VolunteerListItem);
