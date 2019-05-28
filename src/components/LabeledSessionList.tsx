// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        disableFinalDivider: {
            '& a:last-child > div': {
                borderBottomWidth: 0,
            }
        },
        label: {
            paddingLeft: theme.spacing(2),

            marginTop: theme.spacing(1.8),
            marginBottom: theme.spacing(1.8),

            color: theme.palette.text.secondary,
        },
        maxWidth: {
            ...theme.fullWidthPaperMixin,
            marginBottom: theme.spacing(2),
        },
    });

/**
 * Properties accepted by the <LabeledSessionList> component.
 */
interface Properties {
    /**
     * Whether the items in this list should be displayed in a dense manner.
     */
    dense?: boolean;

    /**
     * Label that's to be displayed above the list of sessions.
     */
    label: string;
}

/**
 * Represents a labeled list of sessions. The label will be displayed separate from the sheet.
 */
class LabeledSessionList extends React.PureComponent<Properties & WithStyles<typeof styles>> {
    render() {
        const { children, classes, dense, label } = this.props;

        return (
            <React.Fragment>
                <Typography className={classes.label} variant="subtitle2">
                    {label}
                </Typography>

                <Paper className={classes.maxWidth} square>
                    <List className={classes.disableFinalDivider} dense={dense} disablePadding>
                        {children}
                    </List>
                </Paper>
            </React.Fragment>
        );
    }
}

const StyledLabeledSessionList = withStyles(styles)(LabeledSessionList);
export { StyledLabeledSessionList as LabeledSessionList };
