// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withRoot from '../withRoot';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        errorCard: {
            maxWidth: 600,
        }
    });

class FatalError extends React.Component<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;

        return (
            <Grid
                container
                alignContent="center"
                justify="center"
                style={{ minHeight: '85vh' }}>

                <Card className={classes.errorCard}>
                    <CardHeader
                        title="Volunteer Portal 2019"
                        subheader="A fatal error has occurred and the portal cannot be loaded." />

                    {/* TODO: Add a <CardMedia> element with an image */}
                    {/* TODO: Add a <CardContent> element with a detailed error description */}

                </Card>

            </Grid>
        )
    }
}

export default withRoot(withStyles(styles)(FatalError));
