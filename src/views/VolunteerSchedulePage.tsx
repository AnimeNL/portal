// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import { Volunteer } from '../app/Volunteer';
import VolunteerListItem from '../components/VolunteerListItem';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        // TODO: Define the styles for this element.
    });

/**
 * Properties accepted by the <VolunteerSchedulePage> element.
 */
interface Properties {
    /**
     * The volunteer for whom this page is being displayed.
     */
    volunteer: Volunteer;
}

/**
 *
 */
class VolunteerSchedulePage extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes, volunteer } = this.props;

        return (
            <React.Fragment>

                <Paper square>
                    <List>
                        <VolunteerListItem volunteer={volunteer}
                                           type="header" />
                    </List>
                </Paper>


            </React.Fragment>
        );
    }
}

const StyledVolunteerSchedulePage = withStyles(styles)(VolunteerSchedulePage);
export { StyledVolunteerSchedulePage as VolunteerSchedulePage };
