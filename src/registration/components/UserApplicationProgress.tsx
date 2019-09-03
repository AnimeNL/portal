// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import clsx from 'clsx';

import { Colors } from '../Colors';

import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import brown from '@material-ui/core/colors/brown';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            background: 'none',
            width: '100%',
        }
    });


/**
 * Style for the progress stepper icons.
 */
const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: '50%',
        width: theme.spacing(3),
        height: theme.spacing(3),

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: brown[200],
        color: theme.palette.getContrastText(Colors.kHyperlinkColor),
    },
    completed: {
        backgroundColor: brown[600],
    },
    active: {
        backgroundColor: brown[800],
    },
}));

type StepIconProperties = { active: boolean; completed: boolean; icon: JSX.Element };

/**
 * Component for the step icons. Each icon will be displayed in its own style, to illustrate to the
 * user where in the process their application is.
 */
const StepIcon = (props: StepIconProperties): JSX.Element => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, props.active && classes.active,
                                           props.completed && classes.completed)}>
            1
        </div>
    );
}

/**
 * Properties available to the <UserApplicationProgress> component.
 */
interface UserApplicationProgressProperties {
    /**
     * State of the current user's application as a volunteer for the conference.
     */
    state: 'received';
}

type Properties = UserApplicationProgressProperties & WithStyles<typeof styles>;

/**
 * The <UserApplicationProgress> component
 */
class UserApplicationProgressBase extends React.Component<Properties> {
    render(): JSX.Element {
        const { classes } = this.props;

        return (
            <Stepper className={classes.root} alternativeLabel>
                <Step key={0}>
                    <StepLabel StepIconComponent={StepIcon}>Aanmelding ontvangen</StepLabel>
                </Step>
                <Step key={1}>
                    <StepLabel StepIconComponent={StepIcon}>Aanmelding bevestigd</StepLabel>
                </Step>
                <Step key={2}>
                    <StepLabel StepIconComponent={StepIcon}>Aanmelding compleet</StepLabel>
                </Step>
            </Stepper>
        );
    }
}

export const UserApplicationProgress = withStyles(styles)(UserApplicationProgressBase);
