// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        label: {
            '&:first-child': {
                paddingLeft: '32px',
            },
        },
        playContainer: { marginRight: '0px' },
        play: {
            marginTop: -1,
            color: 'rgba(255, 0, 0, .8)',
            fontSize: '16px',
        },
    });

/**
 * Properties accepted by the <LocationSession> element.
 */
interface Properties {
    /**
     * Whether this session is internal, meaning that it's not been announced to the public.
     */
    internal?: boolean;

    /**
     * Label of the session that this element is describing.
     */
    label: string;

    /**
     * Whether the session described by this list item is active, or still pending.
     */
    state: "active" | "pending";

    /**
     * Timing, if any, to display as part of this element.
     */
    timing?: string;
}

/**
 * Represents a row that's to be displayed in a <LocationCard>, detailing a single session.
 */
class LocationSession extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes, internal, label, state } = this.props;

        // TODO: Use |internal|
        // TODO: Use |timing|

        return (
            <ListItem>
                { state == 'active' &&
                    <ListItemIcon className={classes.playContainer}>
                        <PlayCircleOutlineIcon className={classes.play} />
                    </ListItemIcon> }

                <ListItemText className={classes.label}>
                    {label}
                </ListItemText>

            </ListItem>
        );
    }
}

const StyledLocationSession = withStyles(styles)(LocationSession);
export { StyledLocationSession as LocationSession };
