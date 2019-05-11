// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import blueGrey from '@material-ui/core/colors/blueGrey';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        iconContainer: { minWidth: theme.spacing(4) },

        iconActive: {
            marginTop: -1,
            color: 'rgba(255, 0, 0, .8)',
            fontSize: '16px',
        },
        iconPending: {
            color: 'rgba(0, 0, 0, .2)',
            fontSize: '16px',
        },

        label: {
            // TODO: Make this work correctly on desktop.
            // TODO: 50px to compensate for time-until. Dismiss when |!timing|?
            maxWidth: 'calc(100vw - 50px - 32px - ' + (6 * theme.spacing(1)) + 'px)',

            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',

            '&:first-child': {
                paddingLeft: '32px',
            },
        },

        labelText: { fontSize: 'inherit' },

        labelIconInternal: {
            fontSize: '11px',
            position: 'relative',
            left: theme.spacing(1),
            top: 2,
        },

        timing: {
            color: 'rgba(0, 0, 0, .5)',
            fontSize: '11px',
        }
    });

/**
 * Properties accepted by the <LocationSession> element.
 */
export interface LocationSessionProps {
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
class LocationSession extends React.Component<LocationSessionProps & WithStyles<typeof styles>> {
    render() {
        const { classes, internal, label, state, timing } = this.props;

        return (
            <ListItem>
                <ListItemIcon className={classes.iconContainer}>
                    { state === 'active' ? <PlayCircleOutlineIcon className={classes.iconActive} />
                                         : <MoreHorizIcon className={classes.iconPending} /> }
                </ListItemIcon>

                <ListItemText className={classes.label}
                              style={{ color: internal ? blueGrey[400] : undefined }}
                              primaryTypographyProps={{ className: classes.labelText }}>

                    {label}

                    { internal && <VisibilityOff className={classes.labelIconInternal} /> }

                </ListItemText>

                { timing &&
                    <ListItemSecondaryAction>
                        <Typography className={classes.timing} variant="body1">
                            {timing}
                        </Typography>
                    </ListItemSecondaryAction>}

            </ListItem>
        );
    }
}

const StyledLocationSession = withStyles(styles)(LocationSession);
export { StyledLocationSession as LocationSession };
