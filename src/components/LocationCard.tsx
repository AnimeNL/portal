// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import bind from 'bind-decorator';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        location: {
            margin: theme.spacing(2),
        },
        locationName: {
            // TODO: Make this work correctly on desktop.
            maxWidth: 'calc(100vw - ' + (4 * theme.spacing(1)) + 'px)',

            padding: theme.spacing(1),
            fontWeight: 500,
        },
    });

/**
 * Properties accepted by the <LocationCard> element.
 */
export interface LocationCardProps {
    /**
     * Whether this location is internal, meaning that it's not been announced to the public.
     */
    internal?: boolean;

    /**
     * Label of the location that should be displayed in the header.
     */
    label: string;

    /**
     * Destination where the user should go to after clicking on the destination.
     */
    to?: string;
}

/**
 * The <LocationCard> displays a card for a particular location, wrapping one or more children that
 * indicate the active and upcoming events within this location. If the `to` attribute has been
 * specified, clicking on this location card will trigger a navigation.
 */
class LocationCard extends React.Component<
                               LocationCardProps & RouteComponentProps & WithStyles<typeof styles>> {
    /**
     * Called when the user clicks on the card.
     */
    @bind
    onClick() {
        const { history, to } = this.props;

        // Bail out if the `to` attribute was not provided.
        if (!to)
            return;

        // Push to the history. This will trigger the router to load the next page.
        history.push(to);
    }

    render() {
        const { children, classes, label } = this.props;
        // TODO: Use |internal|

        return (
            <Card className={classes.location}>
                <CardActionArea onClick={this.onClick}>
                    <Typography className={classes.locationName} noWrap variant="body2">
                        {label}
                    </Typography>

                    <Divider />

                    <List dense>
                        {children}
                    </List>

                </CardActionArea>
            </Card>
        );
    }
}

const StyledLocationCard = withRouter(withStyles(styles)(LocationCard));
export { StyledLocationCard as LocationCard };
