// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        expanded: {},

        details: {
            padding: `0 ${theme.spacing(3)}px ${theme.spacing(2)}px`,
        },

        summaryContent: {
            margin: `${theme.spacing(1)}px 0`,

            '&$expanded': {
                margin: '16px 0',
            },
        },
        summaryIcon: {
            padding: theme.spacing(1),
        },
        summaryRoot: {
            minHeight: 40,

            '&$expanded': {
                minHeight: 0,
            },
        },
    });

/**
 * Properties accepted by the <ExpandableDescriptionPaper> component.
 */
interface ExpandableDescriptionPaperProps {
    /**
     * Contents of the collapsed paper that will only be visible once opened.
     */
    children?: React.ReactNode | React.ReactNodeArray;

    /**
     * Title of the collapsed paper, always displayed.
     */
    title: string;
}

/**
 * The <ExpandableDescriptionPaper> component is able to display a titled sheet of paper with
 * contents that are hidden by default, which will only be presented after being activated by the
 * user. People with the "edit-content" flag can add more information here if so desired.
 */
class ExpandableDescriptionPaper extends React.Component<ExpandableDescriptionPaperProps & WithStyles<typeof styles>> {
    render() {
        const { children, classes, title } = this.props;

        return (
            <ExpansionPanel>

                <ExpansionPanelSummary classes={{ content: classes.summaryContent,
                                                  expandIcon: classes.summaryIcon,
                                                  expanded: classes.expanded,
                                                  root: classes.summaryRoot }}
                                       expandIcon={<ExpandMoreIcon />}>

                    <Typography variant="body1">
                        {title}
                    </Typography>

                </ExpansionPanelSummary>

                <ExpansionPanelDetails className={classes.details}>
                    {children}
                </ExpansionPanelDetails>

            </ExpansionPanel>
        );
    }
}

const StyledExpandableDescriptionPaper = withStyles(styles)(ExpandableDescriptionPaper);
export { StyledExpandableDescriptionPaper as ExpandableDescriptionPaper };
