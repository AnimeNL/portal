// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import BrightnessMediumIcon from '@material-ui/icons/BrightnessMedium';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FaceIcon from '@material-ui/icons/Face';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import PhoneIcon from '@material-ui/icons/Phone';
import SearchIcon from '@material-ui/icons/Search';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        card: {
            margin: theme.spacing(2),
        },

        tipContent: {
            padding: `0 ${theme.spacing(1)}px !important`,
        },
        tipList: {
            padding: `0 ${theme.spacing(2)}px`,
        }
    });

/**
 * Properties accepted by the <OverviewPage> element.
 */
interface Properties {
    // TODO: Define the properties for this element.
}

/**
 * Interface defining a tip that can be displayed on the overview page.
 */
interface Tip {
    title: string;
    description: string;
    icon: JSX.Element;
}

/**
 * List of tips that can be displayed on the overview page. A random tip will be chosen each time
 * the page renders. Try to minimize the number of different icons in this list.
 */
const kTips: Tip[] = [
    {
        title: 'Need a senior?',
        description: 'Did you know that you can quickly call a senior by clicking on the phone ' +
                     'icon on their schedule page?',
        icon: <PhoneIcon />
    },
    {
        title: 'Looking for something?',
        description: 'Did you know that you can quickly search for volunteers, locations and ' +
                     'events from the header bar?',
        icon: <SearchIcon />
    },
    {
        title: 'Overwhelmed by light?',
        description: 'Did you know that the portal supports a dark theme? Enable it on your ' +
                     'phone or through the top-right menu.',
        icon: <BrightnessMediumIcon />
    },
    {
        title: 'Not sure what to do?',
        description: 'Did you know that most shifts come with instructions? Check them out on ' +
                     'the event pages, or ask a senior.',
        icon: <FaceIcon />
    },
    {
        title: 'Not sure what\'s happening?',
        description: 'Did you know that events that are currently happening are highlighted, and ' +
                     'past events will be moved down?',
        icon: <LiveTvIcon />
    }
];

class OverviewPage extends React.Component<Properties & WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        // TODO: Personalize the introduction card with whatever we've got available.
        // TODO: Display a card with volunteer's next session.

        // Choose a random tip to display on the overview page.
        const tip = kTips[Math.floor(Math.random() * kTips.length)];

        return (
            <React.Fragment>
                <Card className={classes.card}>
                    <CardContent>
                        {/* Introduction goes here */}
                    </CardContent>
                </Card>

                <Card className={classes.card}>
                    <CardContent className={classes.tipContent}>
                        <List className={classes.tipList}>
                            <ListItem>
                                <ListItemIcon>
                                    {tip.icon}
                                </ListItemIcon>
                                <ListItemText primary={tip.title}
                                              secondary={tip.description} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(OverviewPage);
