// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FullPage from '../components/FullPage';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = () =>
    createStyles({
        errorCard: {
            maxWidth: 600,
        }
    });

interface FatalErrorProperties extends WithStyles<typeof styles> {
    // Human-readable description of the fatal error that occurred.
    error: string;
};

class FatalError extends React.Component<FatalErrorProperties> {
    render() {
        const { classes, error } = this.props;

        return (
            <FullPage>
                <Card className={classes.errorCard}>

                    <CardHeader
                        title="Volunteer Portal"
                        subheader={error} />

                    <CardContent>

                        <Typography component="p">
                            The portal cannot automatically recover from this error. Please
                            contact <a href="tel:+447427457387">Peter</a> so that he can take a look
                            at the issue.
                        </Typography>

                    </CardContent>

                </Card>
            </FullPage>
        )
    }
}

export default withStyles(styles)(FatalError);
