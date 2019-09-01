// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import bind from 'bind-decorator';

import { Colors } from '../Colors';
import { MarkdownView } from './MarkdownView';
import { RegistrationProperties } from '../RegistrationProperties';
import { UserControllerContext } from '../controllers/UserControllerContext';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import { WithStyles, default as withStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { darken } from '@material-ui/core/styles/colorManipulator';

/**
 * These pathnames map to pages that we can obtain through the content provider.
 */
const kRegistrationIntro = '/registration/internal/intro';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(2),

            '& a': { color: Colors.kHyperlinkColor },
            '& sup': {
                color: 'red',
            },
        },
        title: {
            marginBottom: 0,
        },
        label: {
            display: 'flex',
            alignItems: 'center',
        },
        button: {
            backgroundColor: Colors.kHyperlinkColor,
            color: theme.palette.getContrastText(Colors.kHyperlinkColor) + ' !important',
            marginBottom: theme.spacing(2),

            '&:hover': {
                backgroundColor: darken(Colors.kHyperlinkColor, theme.palette.tonalOffset),
            }
        },
        buttonIcon: {
            marginRight: theme.spacing(1),
        }
    });

/**
 * State internal to the <RegistrationViewBase> component.
 */
interface InternalState {
    /**
     * Cached React component for the introduction text. Created at mount time.
     */
    introText?: JSX.Element;

    /**
     * Values of the individual fields in the form.
     */
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    telephoneNumber?: string;
    dateOfBirth: string;
    fullAvailability?: string;
    nightShifts?: string;
    socialMedia?: string;
    dataProcessing?: string;
}

/**
 * Joint type definition of the Registration application properties and routing + styling ones.
 */
type Properties = RegistrationProperties & RouteComponentProps & WithStyles<typeof styles>;

/**
 * The registration view provides users with the ability to sign up for volunteering at this event.
 * We'll ask them for all necessary information, which will be validated and uploaded when ready.
 */
class RegistrationViewBase extends React.Component<Properties, InternalState> {
    static contextType = UserControllerContext;
    
    /**
     * The user context available to the registration form. Will be set by React.
     */
    context!: React.ContextType<typeof UserControllerContext>;

    state: InternalState = {
        dateOfBirth: 'January 1, 1990',  // initial value
    };

    componentDidMount() {
        const { contentProvider } = this.props;

        // Cache the registration introduction if it's known to the content provider.
        if (!contentProvider.hasPage(kRegistrationIntro))
            return;

        const content = contentProvider.getPageContent(kRegistrationIntro);

        this.setState({
            introText: <MarkdownView content={content} />
        });
    }

    /**
     * Handles an updated value in one of the textual input fields, and updates the internal state
     * to match the update.
     */
    @bind
    handleTextUpdate(event: React.ChangeEvent<HTMLInputElement>): void {
        switch (event.target.name) {
            case 'firstName': this.setState({ firstName: event.target.value }); break;
            case 'lastName': this.setState({ lastName: event.target.value }); break;
            case 'emailAddress': this.setState({ emailAddress: event.target.value }); break;
            case 'telephoneNumber': this.setState({ telephoneNumber: event.target.value }); break;
            default:
                throw new Error('Unknown text field update: ' + event.target.name);
        }
    }

    /**
     * Handles an updated value in the date of birth field, and updates the internal state.
     */
    @bind
    handleDateUpdate(date: unknown, value?: string | null): void {
        if (!value) return;

        this.setState({ dateOfBirth: value });
    }

    /**
     * Handles an updated value in one of the select boxes, and updates the internal state to match.
     */
    @bind
    handleSelectUpdate(event: React.ChangeEvent<{ name?: string; value: unknown }>): void {
        const stateValue: string | undefined =
            typeof event.target.value === 'string' ? event.target.value as string
                                                   : undefined;

        switch (event.target.name) {
            case 'fullAvailability': this.setState({ fullAvailability: stateValue }); break;
            case 'nightShifts': this.setState({ nightShifts: stateValue }); break;
            case 'socialMedia': this.setState({ socialMedia: stateValue }); break;
            case 'dataProcessing': this.setState({ dataProcessing: stateValue }); break;
            default:
                throw new Error('Unknown select field update: ' + event.target.name);
        }
    }

    /**
     * Called when the form is being submitted. All fields will be validated per the requirements
     * of the UserControllerContext, after which a registration request will be started.
     */
    @bind
    handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        // TODO: Start the validation.
        console.log(this.state);
    }

    render(): JSX.Element {
        const { classes } = this.props;
        const { introText } = this.state;

        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                {introText}

                <Divider />

                <form onSubmit={this.handleSubmit}>
                    <div className={classes.root}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" className={classes.title}>
                                    Persoonlijke informatie
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name="firstName"
                                           label="Voornaam"
                                           margin="none"
                                           variant="outlined"
                                           autoComplete="given-name"
                                           onChange={this.handleTextUpdate}
                                           value={this.state.firstName}
                                           required fullWidth />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField name="lastName"
                                           label="Achternaam"
                                           margin="none"
                                           variant="outlined"
                                           autoComplete="family-name"
                                           onChange={this.handleTextUpdate}
                                           value={this.state.lastName}
                                           required fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="emailAddress"
                                           label="E-mailadres"
                                           margin="none"
                                           variant="outlined"
                                           autoComplete="email"
                                           type="email"
                                           onChange={this.handleTextUpdate}
                                           value={this.state.emailAddress}
                                           required fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="telephoneNumber"
                                           label="Telefoonnummer"
                                           margin="none"
                                           variant="outlined"
                                           autoComplete="tel"
                                           type="tel"
                                           onChange={this.handleTextUpdate}
                                           value={this.state.telephoneNumber}
                                           required fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth>
                                    <KeyboardDatePicker name="dateOfBirth"
                                                        label="Geboortedatum"
                                                        inputVariant="outlined" 
                                                        onChange={this.handleDateUpdate}
                                                        format="DD/MM/YYYY"
                                                        value={this.state.dateOfBirth}
                                                        disableFuture />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" className={classes.title}>
                                    Algemene Voorkeuren
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3} className={classes.label}>
                                <Typography variant="body1">
                                    Volledig weekend aanwezig? <sup>(1)</sup>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={9}>
                                <FormControl variant="outlined" fullWidth>
                                    <Select name="fullAvailability"
                                            input={<OutlinedInput labelWidth={0} />}
                                            onChange={this.handleSelectUpdate}
                                            value={this.state.fullAvailability} fullWidth>
                                        <MenuItem value="true">Ja</MenuItem>
                                        <MenuItem value="false">Nee</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3} className={classes.label}>
                                <Typography variant="body1">
                                    Kan je 's nachts meehelpen?
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={9}>
                                <FormControl variant="outlined" fullWidth>
                                    <Select name="nightShifts"
                                            input={<OutlinedInput labelWidth={0} />}
                                            onChange={this.handleSelectUpdate}
                                            value={this.state.nightShifts} fullWidth>
                                        <MenuItem value="true">Ja</MenuItem>
                                        <MenuItem value="false">Nee</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3} className={classes.label}>
                                <Typography variant="body1">
                                    Deelname in social media? <sup>(2)</sup>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={9}>
                                <FormControl variant="outlined" fullWidth>
                                    <Select name="socialMedia"
                                            input={<OutlinedInput labelWidth={0} />}
                                            onChange={this.handleSelectUpdate}
                                            value={this.state.socialMedia} fullWidth>
                                        <MenuItem value="true">Ja</MenuItem>
                                        <MenuItem value="false">Nee</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3} className={classes.label}>
                                <Typography variant="body1">
                                    Akkoord met dataverwerking? <sup>(3)</sup>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={9}>
                                <FormControl variant="outlined" fullWidth>
                                    <Select name="dataProcessing"
                                            input={<OutlinedInput labelWidth={0} />}
                                            onChange={this.handleSelectUpdate}
                                            value={this.state.dataProcessing} fullWidth>
                                        <MenuItem value="true">Ja</MenuItem>
                                        <MenuItem value="false">Nee</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" className={classes.button}>
                                    <HowToRegIcon className={classes.buttonIcon} />
                                    Meld je aan!
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </form>

                <Divider />

                <Typography variant="body1" className={classes.root}>
                    <sup>(1)</sup> We verwachten dat je het volledige weekend aanwezig kan zijn.
                    Neem contact met ons op indien dat niet het geval is.<br />
                    <sup>(2)</sup> We hebben zowel een WhatsApp als een Facebook groep voor de
                    vrijwilligers. Deelname is optioneel, maar erg gezellig!<br />
                    <sup>(3)</sup> Zie de aparte pagina met meer informatie over
                    onze <Link to="dataverwerking.html">dataverwerking</Link>.
                </Typography>

            </MuiPickersUtilsProvider>
        );
    }
}

export const RegistrationView = withStyles(styles)(RegistrationViewBase);
