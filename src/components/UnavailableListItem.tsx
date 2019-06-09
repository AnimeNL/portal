// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import moment from 'moment';

import AlarmIcon from '@material-ui/icons/AlarmOff';
import ListItem from '@material-ui/core/ListItem';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import grey from '@material-ui/core/colors/grey';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        unavailableIcon: {
            fontSize: 'inherit',
            marginRight: theme.spacing(1),
        },
        unavailable: {
            backgroundColor: theme.palette.error.dark,
            color: theme.palette.error.contrastText,

            borderTop: '1px solid ' + theme.palette.divider,
            marginBottom: theme.spacing(-1),
        },
    });

/**
 * Properties for the <UnavailableListItem> component.
 */
interface Properties {
    /**
     * Moment until which the volunteer will be unavailable.
     */
    until: moment.Moment;
}

/**
 * The <UnavailableListItem> component can be used in a volunteer header to indicate the fact that
 * the volunteer is unavailable until a preconfigured time.
 */
class UnavailableListItem extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes, until } = this.props;

        return (
            <ListItem className={classes.unavailable}>
                <AlarmIcon className={classes.unavailableIcon} />
                Unavailable until {until.format('HH:mm')}
            </ListItem>
        );
    }
}

const StyledUnavailableListItem = withStyles(styles)(UnavailableListItem);
export { StyledUnavailableListItem as UnavailableListItem };
