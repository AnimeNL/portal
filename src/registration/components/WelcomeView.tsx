// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import { Link } from 'react-router-dom';

import { MarkdownView } from './MarkdownView';
import { RegistrationProperties } from '../RegistrationProperties';
import { kHomePageUrl } from '../ContentProvider';

import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

/**
 * The Welcome view is what users are presented with when they visit the portal's root without
 * having access to the schedule application.
 */
export class WelcomeView extends React.PureComponent<RegistrationProperties> {
    render() {
        const { contentProvider } = this.props;

        const content = contentProvider.getPageContent(kHomePageUrl);

        return (
            <>
                <MarkdownView content={content} />

                <Divider />
                <List style={{ padding: 0 }}>
                    <ListItem component={Link} to="/registration/" button divider>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Vrijwilliger worden?" />
                    </ListItem>
                    <ListItem component="a" href="https://animecon.nl/" button>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="AnimeCon website…" />
                    </ListItem>
                </List>
            </>
        );
    }
}
