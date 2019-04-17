// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FullPage from '../components/FullPage';
import Typography from '@material-ui/core/Typography';

interface Properties {
    // Human-readable description of the fatal error that occurred.
    message: string;
};

class ErrorView extends React.Component<Properties> {
    render() {
        return (
            <FullPage>
                <Card>
                    <CardHeader
                        title="Volunteer Portal"
                        subheader={this.props.message} />
                    <CardContent>
                        <Typography component="p">
                            The portal cannot automatically recover from this error. Please
                            contact <a href="tel:+447427457387">Peter</a> so that the issue can be
                            resolved as soon as possible.
                        </Typography>
                    </CardContent>
                </Card>
            </FullPage>
        )
    }
}

export default ErrorView;
