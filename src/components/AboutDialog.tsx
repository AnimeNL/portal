// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import React from 'react';
import bind from 'bind-decorator';

import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = (theme: Theme) =>
    createStyles({
        paper: {
            backgroundColor: theme.menuActiveBackgroundColor,
        },

        appBar: {
            backgroundColor: theme.headerBackgroundColor,
            position: 'relative',
        },

        header: { paddingBottom: theme.spacing(.5) },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },

        jpopLogo: {
            backgroundColor: '#104656',
            background: 'url(/static/images/jpop-portal-logo.png) center / contain no-repeat',
            margin: theme.spacing(1) + 'px 0 0 0',

            height: 200,
            width: '100%',
        },

        card: {
            margin: theme.spacing(2),
            overflow: 'visible',

            '& strong': {
                fontWeight: 500,
            },
        },

        list: {
            marginBottom: theme.spacing(-1),
            paddingBottom: 0,
        }
    });

interface Contributor { name: string; github: string; };

/**
 * List of contributors that participated in creating the portal.
 */
const kContributors: Contributor[] = [
    { name: 'Ferdi van der Werf', github: 'fuegas' },
    { name: 'Patrick Uiterwijk', github: 'puiterwijk' },
    { name: 'Peter Beverloo', github: 'beverloo' },
];

/**
 * Properties accepted by the <AboutDialog> component.
 */
interface Properties {
    /**
     * Event to be called when the dialog has to be closed.
     */
    onClose: () => void;

    /**
     * Whether the dialog should be opened.
     */
    open?: boolean;
}

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) =>
    <Slide direction="up" ref={ref} {...props} />);

/**
 * The <AboutDialog> component displays a page with general information about the portal, the
 * technologies it uses and the authors and contributors. If you use the portal for your own
 * conference, we kindly ask you to continue to include this page in the application.
 */
class AboutDialog extends React.Component<Properties & WithStyles<typeof styles>> {
    /**
     * Navigates to the project page of the portal.
     */
    @bind
    navigateToProjectPage() {
        window.open('https://github.com/AnimeNL/portal', '_blank');
    }

    /**
     * Navigates to the given GitHub account page.
     */
    @bind
    navigateToGitHubProfile(github: string) {
        window.open('https://github.com/' + github, '_blank');
    }

    render() {
        const { classes, onClose, open } = this.props;

        return (
            <Dialog PaperProps={{ className: classes.paper }}
                    TransitionComponent={Transition}
                    onClose={onClose}
                    open={!!open}
                    fullScreen>

                <AppBar className={classes.appBar} position="fixed">
                    <Toolbar>

                        <IconButton edge="start" color="inherit" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>

                        <Typography noWrap variant="h6" className={classes.title}>
                            About the Volunteer Portal
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className={classes.jpopLogo}></div>

                <Card className={classes.card}
                      onClick={this.navigateToProjectPage}
                      style={{ cursor: 'pointer' }}>

                    <CardContent>
                        <Typography variant="h5" className={classes.header}>
                            Volunteer Portal
                        </Typography>

                        <Typography variant="body2">
                            The Volunteer Portal was created by <strong>Peter Beverloo</strong> for
                            the AnimeCon 2019 conference, and is available as an open source
                            project on GitHub.
                        </Typography>
                    </CardContent>

                </Card>

                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="h5">
                            Contributors
                        </Typography>

                        <List className={classes.list}>
                            { kContributors.map((contributor, index) =>
                                <ListItem onClick={() => this.navigateToGitHubProfile(contributor.github)}
                                          key={index}
                                          button>

                                    <ListItemIcon>
                                        <FavoriteIcon />
                                    </ListItemIcon>

                                    <ListItemText primary={contributor.name} />

                                </ListItem> )}
                        </List>
                    </CardContent>
                </Card>

            </Dialog>
        );
    }
}

const StyledAboutDialog = withStyles(styles)(AboutDialog);
export { StyledAboutDialog as AboutDialog };
