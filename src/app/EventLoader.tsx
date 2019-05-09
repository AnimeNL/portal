// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IEvent } from './api/IEvent';
import { IFloor } from './api/IFloor';
import { ILocation } from './api/ILocation';
import { IProgramEvent } from './api/IProgramEvent';
import { IProgramSession } from './api/IProgramSession';
import { IVolunteerInfo } from './api/IVolunteerInfo';
import { IVolunteerGroup } from './api/IVolunteerGroup';
import { EventPath, mockableFetch } from '../config';
import { isBoolean, isNumber, isString, isStringOrNull } from './util/Validators';

/**
 * Enumeration detailing the possible outcomes of loading the event data.
 */
enum LoadResult {
    /**
     * Loading was successful.
     */
    Success,

    /**
     * Loading failed because of a network issue.
     */
    NetworkError,

    /**
     * Loading failed because the data was not valid JSON.
     */
    DataFormatError,

    /**
     * Loading failed because the response didn't follow the right interfaces.
     */
    InterfaceFormatError,

    /**
     * Loading failed because of a failure, causing the server to be unable to return event data.
     */
    FailureError,

    /**
     * Loading failed, but the exact reason can't be determined.
     */
    UnknownError
}

/**
 * Provides the ability to load the event, either from the network or from local storage. Should
 * be considered as an implementation detail of the Event class. Validates received data.
 */
class EventLoader {
    result?: LoadResult;
    event?: IEvent;

    /**
     * Attempts to load the event data. This will be done in a series of steps:
     *   (1) Fetch the data either from the network, or from local storage.
     *   (2) Validate that the user is allowed to access the information.
     *   (3) Validate that all received data conforms to the API.
     *
     * @param authToken Authentication token for which the data will be fetched.
     * @returns A promise that will be resolved once the load result is known
     */
    async load(authToken: string): Promise<boolean> {
        try {
            const url = new URL(EventPath, window.location.href);
            url.searchParams.append('authToken', authToken);

            const response = await mockableFetch(url.href);
            if (!response.ok) {
                this.result = LoadResult.NetworkError;
                return false;
            }

            const eventData = JSON.parse(await response.text());
            if (!eventData) {
                this.result = LoadResult.DataFormatError;
                return false;
            }

            // We consider it a user error when `success` has been set to false. In reality this
            // could still mean that the `success` parameter is missing altogether, or another
            // condition (such as request method) couldn't be verified by the server.
            if (!eventData.success) {
                this.result = LoadResult.FailureError;
                return false;
            }

            // Verify that the |eventData| conforms to the interface definition of IEvent. If that's
            // not the case then we have data, we just can't trust it.
            if (!this.validateEvent(eventData)) {
                this.result = LoadResult.InterfaceFormatError;
                return false;
            }

            this.result = LoadResult.Success;
            this.event = eventData;
            return true;

        } catch (e) {
            console.error('Loading the event data failed.', e);
            this.result = LoadResult.UnknownError;
        }

        return false;
    }

    /**
     * Returns whether the load failed due to a user issue. Throws if loading was successful or
     * hasn't yet been started yet.
     */
    isUserError(): boolean {
        if (this.result === undefined || this.result === LoadResult.Success)
            throw new Error('Loading must have failed for this accessor to function.');

        return this.result === LoadResult.FailureError;
    }

    /**
     * Returns whether the load failed due to a device or server issue. Throws if loading was
     * successful or hasn't yet been started yet.
     */
    isDeviceOrServerError(): boolean {
        if (this.result === undefined || this.result === LoadResult.Success)
            throw new Error('Loading must have failed for this accessor to function.');

        return this.result === LoadResult.NetworkError ||
               this.result === LoadResult.DataFormatError ||
               this.result === LoadResult.InterfaceFormatError ||
               this.result === LoadResult.UnknownError;
    }

    /**
     * Gets the data in validated IEvent format.
     */
    get eventData(): IEvent {
        if (this.result !== LoadResult.Success && this.event !== undefined)
            throw new Error('Loading must have succeeded for this accessor to function.');

        return this.event!;
    }

    /**
     * Validates that the given |event| matches the interfaces defined for interaction with the
     * backend. Verification failures will be considered fatal by the portal.
     *
     * @param event The data as fetched from an untrusted source.
     * @return Whether the given |event| conforms to the IEvent interface.
     */
    private validateEvent(event: any): event is IEvent {
        if (!event.hasOwnProperty('success') || !isBoolean(event.success)) {
            console.error('Unable to validate IEvent.success.');
            return false;
        }

        if (!event.hasOwnProperty('events') || !Array.isArray(event.events)) {
            console.error('Unable to validate IEvent.events');
            return false;
        }

        for (const programEvent of event.events) {
            if (!this.validateProgramEvent(programEvent))
                return false;
        }

        if (!event.hasOwnProperty('floors') || !Array.isArray(event.floors)) {
            console.error('Unable to validate IEvent.floors');
            return false;
        }

        for (const floor of event.floors) {
            if (!this.validateFloor(floor))
                return false;
        }

        if (event.hasOwnProperty('internalNotes')) {
            if (typeof event.internalNotes !== 'object') {
                console.error('Unable to validate IEvent.internalNotes');
                return false;
            }

            for (const key of Object.keys(event.internalNotes)) {
                if (!isString(key) || !isString(event.internalNotes[key])) {
                    console.error('Unable to validate IEvent.internalNotes');
                    return false;
                }
            }
        }

        if (!event.hasOwnProperty('locations') || !Array.isArray(event.locations)) {
            console.error('Unable to validate IEvent.locations');
            return false;
        }

        for (const location of event.locations) {
            if (!this.validateLocation(location))
                return false;
        }

        if (!event.hasOwnProperty('volunteerGroups') || !Array.isArray(event.volunteerGroups)) {
            console.error('Unable to validate IEvent.volunteerGroups.');
            return false;
        }

        for (const volunteerGroup of event.volunteerGroups) {
            if (!this.validateVolunteerGroup(volunteerGroup))
                return false;
        }

        if (!event.hasOwnProperty('volunteers') || !Array.isArray(event.volunteers)) {
            console.error('Unable to validate IEvent.volunteers.');
            return false;
        }

        for (const volunteerInfo of event.volunteers) {
            if (!this.validateVolunteerInfo(volunteerInfo))
                return false;
        }

        return true;
    }

    /**
     * Validates that the given |floor| matches the IFloor interface.
     *
     * @param floor The data as fetched from an untrusted source.
     * @return Whether the given |floor| conforms to the IFloor interface.
     */
    private validateFloor(floor: any): floor is IFloor {
        if (!floor.hasOwnProperty('id') || !isNumber(floor.id)) {
            console.error('Unable to validate IFloor.id.');
            return false;
        }

        if (!floor.hasOwnProperty('label') || !isString(floor.label)) {
            console.error('Unable to validate IFloor.label.');
            return false;
        }

        if (!floor.hasOwnProperty('iconColor') || !isStringOrNull(floor.iconColor)) {
            console.error('Unable to validate IFloor.iconColor.');
            return false;
        }

        if (!floor.hasOwnProperty('icon') || !isStringOrNull(floor.icon)) {
            console.error('Unable to validate IFloor.icon.');
            return false;
        }

        return true;
    }

    /**
     * Validates that the given |location| matches the ILocation interface.
     *
     * @param location The data as fetched from an untrusted source.
     * @return Whether the given |location| conforms to the ILocation interface.
     */
    private validateLocation(location: any): location is ILocation {
        if (!location.hasOwnProperty('id') || !isNumber(location.id)) {
            console.error('Unable to validate ILocation.id.');
            return false;
        }

        if (!location.hasOwnProperty('floorId') || !isNumber(location.floorId)) {
            console.error('Unable to validate ILocation.floorId.');
            return false;
        }

        if (!location.hasOwnProperty('label') || !isString(location.label)) {
            console.error('Unable to validate ILocation.label.');
            return false;
        }

        return true;
    }

    /**
     * Validates that the given |programEvent| matches the IProgramEvent interface.
     *
     * @param programEvent The data as fetched from an untrusted source.
     * @return Whether the given |programEvent| conforms to the IProgramEvent interface.
     */
    private validateProgramEvent(programEvent: any): programEvent is IProgramEvent {
        if (!programEvent.hasOwnProperty('id') || !isNumber(programEvent.id)) {
            console.error('Unable to validate IProgramEvent.id.');
            return false;
        }

        if (!programEvent.hasOwnProperty('internal') || !isBoolean(programEvent.internal)) {
            console.error('Unable to validate IProgramEvent.internal.');
            return false;
        }

        if (!programEvent.hasOwnProperty('sessions') || !Array.isArray(programEvent.sessions)) {
            console.error('Unable to validate IProgramEvent.icon.');
            return false;
        }

        for (const programSession of programEvent.sessions) {
            if (!this.validateProgramSession(programSession))
                return false;
        }

        return true;
    }

    /**
     * Validates that the given |programSession| matches the IProgramSession interface.
     *
     * @param programSession The data as fetched from an untrusted source.
     * @return Whether the given |programSession| conforms to the IProgramSession interface.
     */
    private validateProgramSession(programSession: any): programSession is IProgramSession {
        if (!programSession.hasOwnProperty('name') || !isString(programSession.name)) {
            console.error('Unable to validate IProgramSession.name.');
            return false;
        }

        if (!programSession.hasOwnProperty('description') ||
            !isStringOrNull(programSession.description)) {
            console.error('Unable to validate IProgramSession.description.');
            return false;
        }

        if (!programSession.hasOwnProperty('locationId') || !isNumber(programSession.locationId)) {
            console.error('Unable to validate IProgramSession.locationId.');
            return false;
        }

        if (!programSession.hasOwnProperty('beginTime') || !isNumber(programSession.beginTime)) {
            console.error('Unable to validate IProgramSession.beginTime.');
            return false;
        }

        if (!programSession.hasOwnProperty('endTime') || !isNumber(programSession.endTime)) {
            console.error('Unable to validate IProgramSession.endTime.');
            return false;
        }

        return true;
    }

    /**
     * Validates that the given |volunteerGroup| matches the IVolunteerGroup interface.
     *
     * @param volunteerGroup The data as fetched from an untrusted source.
     * @return Whether the given |volunteerGroup| conforms to the IVolunteerGroup interface.
     */
    private validateVolunteerGroup(volunteerGroup: any): volunteerGroup is IVolunteerGroup {
        if (!volunteerGroup.hasOwnProperty('groupToken') || !isString(volunteerGroup.groupToken)) {
            console.error('Unable to validate IVolunteerGroup.groupToken.');
            return false;
        }

        if (!volunteerGroup.hasOwnProperty('primary') || !isBoolean(volunteerGroup.primary)) {
            console.error('Unable to validate IVolunteerGroup.primary.');
            return false;
        }

        if (!volunteerGroup.hasOwnProperty('label') || !isString(volunteerGroup.label)) {
            console.error('Unable to validate IVolunteerGroup.label.');
            return false;
        }

        return true;
    }

    /**
     * Validates that the given |volunteerInfo| matches the IVolunteerInfo interface.
     *
     * @param volunteerInfo The data as fetched from an untrusted source.
     * @return Whether the given |volunteerInfo| conforms to the IVolunteerInfo interface.
     */
    private validateVolunteerInfo(volunteerInfo: any): volunteerInfo is IVolunteerInfo {
        if (!volunteerInfo.hasOwnProperty('userToken') || !isString(volunteerInfo.userToken)) {
            console.error('Unable to validate IVolunteerInfo.userToken.');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('groupToken') || !isString(volunteerInfo.groupToken)) {
            console.error('Unable to validate IVolunteerInfo.groupToken.');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('name') || !isString(volunteerInfo.name)) {
            console.error('Unable to validate IVolunteerInfo.name.');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('avatar') || !isStringOrNull(volunteerInfo.avatar)) {
            console.error('Unable to validate IVolunteerInfo.avatar.');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('title') || !isString(volunteerInfo.title)) {
            console.error('Unable to validate IVolunteerInfo.title.');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('accessCode') ||
            !isStringOrNull(volunteerInfo.accessCode)) {
            console.error('Unable to validate IVolunteerInfo.accessCode.');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('telephone') ||
            !isStringOrNull(volunteerInfo.telephone)) {
            console.error('Unable to validate IVolunteerInfo.telephone.');
            return false;
        }

        return true;
    }

}

export default EventLoader;
