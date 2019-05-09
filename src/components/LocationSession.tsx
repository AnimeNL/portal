// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import LockIcon from '@material-ui/icons/Lock';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        activeSession: {
            // TODO: Styling for active sessions in the location card.
            color: 'red',
        },
        pendingSession: {
            // TODO: Styling for future sessions in the location card.
            color: 'blue',
        },
        internalEvent: {
            backgroundColor: 'yellow',
        },

        internalIcon: {
            marginRight: theme.spacing.unit / 2,
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
        // TODO: Use |timing|

        let internalLock: JSX.Element | null = null;

        if (internal) {
            internalLock = <LockIcon className={classes.internalIcon}
                                     fontSize="inherit" />;
        }

        // TODO: Use |internal|
        const className = state == 'active' ? classes.activeSession
                                            : classes.pendingSession;

        return (
            <ListItem className={ className }>
                {internal}
                {label}
            </ListItem>
        );
    }
}

const StyledLocationSession = withStyles(styles)(LocationSession);
export { StyledLocationSession as LocationSession };
