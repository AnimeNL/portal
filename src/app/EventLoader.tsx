// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IEvent } from './api/IEvent';
import { IFloor } from './api/IFloor';
import { ILocation } from './api/ILocation';
import { IProgramEvent } from './api/IProgramEvent';
import { IProgramSession } from './api/IProgramSession';
import { IShift } from './api/IShift';
import { IVolunteerInfo } from './api/IVolunteerInfo';
import { IVolunteerGroup } from './api/IVolunteerGroup';
import { EventPath, mockableFetch } from '../config';
import { isBoolean, isNumber, isNumberOrNull, isString, isStringOrNull, validationError } from './util/Validators';

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
        const kInterface = 'IEvent';

        if (!event.hasOwnProperty('success') || !isBoolean(event.success)) {
            validationError(kInterface, 'success');
            return false;
        }

        if (!event.hasOwnProperty('events') || !Array.isArray(event.events)) {
            validationError(kInterface, 'events');
            return false;
        }

        for (const programEvent of event.events) {
            if (!this.validateProgramEvent(programEvent))
                return false;
        }

        if (!event.hasOwnProperty('floors') || !Array.isArray(event.floors)) {
            validationError(kInterface, 'floors');
            return false;
        }

        for (const floor of event.floors) {
            if (!this.validateFloor(floor))
                return false;
        }

        if (event.hasOwnProperty('internalNotes')) {
            if (typeof event.internalNotes !== 'object') {
                validationError(kInterface, 'internalNotes');
                return false;
            }

            for (const key of Object.keys(event.internalNotes)) {
                if (!isString(key) || !isString(event.internalNotes[key])) {
                    validationError(kInterface, 'internalNotes');
                    return false;
                }
            }
        }

        if (!event.hasOwnProperty('locations') || !Array.isArray(event.locations)) {
            validationError(kInterface, 'locations');
            return false;
        }

        for (const location of event.locations) {
            if (!this.validateLocation(location))
                return false;
        }

        if (!event.hasOwnProperty('shifts') || !Array.isArray(event.shifts)) {
            validationError(kInterface, 'shifts');
            return false;
        }

        for (const shift of event.shifts) {
            if (!this.validateShift(shift))
                return false;
        }

        if (!event.hasOwnProperty('volunteerGroups') || !Array.isArray(event.volunteerGroups)) {
            validationError(kInterface, 'volunteerGroups');
            return false;
        }

        for (const volunteerGroup of event.volunteerGroups) {
            if (!this.validateVolunteerGroup(volunteerGroup))
                return false;
        }

        if (!event.hasOwnProperty('volunteers') || !Array.isArray(event.volunteers)) {
            validationError(kInterface, 'volunteers');
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
        const kInterface = 'IFloor';

        if (!floor.hasOwnProperty('id') || !isNumber(floor.id)) {
            validationError(kInterface, 'id');
            return false;
        }

        if (!floor.hasOwnProperty('label') || !isString(floor.label)) {
            validationError(kInterface, 'label');
            return false;
        }

        if (!floor.hasOwnProperty('iconColor') || !isStringOrNull(floor.iconColor)) {
            validationError(kInterface, 'iconColor');
            return false;
        }

        if (!floor.hasOwnProperty('icon') || !isStringOrNull(floor.icon)) {
            validationError(kInterface, 'icon');
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
        const kInterface = 'ILocation';

        if (!location.hasOwnProperty('id') || !isNumber(location.id)) {
            validationError(kInterface, 'id');
            return false;
        }

        if (!location.hasOwnProperty('floorId') || !isNumber(location.floorId)) {
            validationError(kInterface, 'floorId');
            return false;
        }

        if (!location.hasOwnProperty('label') || !isString(location.label)) {
            validationError(kInterface, 'label');
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
        const kInterface = 'IProgramEvent';

        if (!programEvent.hasOwnProperty('id') || !isNumber(programEvent.id)) {
            validationError(kInterface, 'id');
            return false;
        }

        if (!programEvent.hasOwnProperty('internal') || !isBoolean(programEvent.internal)) {
            validationError(kInterface, 'internal');
            return false;
        }

        if (!programEvent.hasOwnProperty('notes') || !isStringOrNull(programEvent.notes)) {
            validationError(kInterface, 'notes');
            return false;
        }

        if (!programEvent.hasOwnProperty('sessions') || !Array.isArray(programEvent.sessions)) {
            validationError(kInterface, 'icon');
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
        const kInterface = 'IProgramSession';

        if (!programSession.hasOwnProperty('name') || !isString(programSession.name)) {
            validationError(kInterface, 'name');
            return false;
        }

        if (!programSession.hasOwnProperty('description') ||
            !isStringOrNull(programSession.description)) {
            validationError(kInterface, 'description');
            return false;
        }

        if (!programSession.hasOwnProperty('locationId') || !isNumber(programSession.locationId)) {
            validationError(kInterface, 'locationId');
            return false;
        }

        if (!programSession.hasOwnProperty('beginTime') || !isNumber(programSession.beginTime)) {
            validationError(kInterface, 'beginTime');
            return false;
        }

        if (!programSession.hasOwnProperty('endTime') || !isNumber(programSession.endTime)) {
            validationError(kInterface, 'endTime');
            return false;
        }

        return true;
    }

    /**
     * Validates that the given |shift| matches the IShift interface.
     *
     * @param location The data as fetched from an untrusted source.
     * @return Whether the given |shift| conforms to the IShift interface.
     */
    private validateShift(shift: any): shift is IShift {
        const kInterface = 'IShift';

        if (!shift.hasOwnProperty('userToken') || !isString(shift.userToken)) {
            validationError(kInterface, 'userToken');
            return false;
        }

        if (!shift.hasOwnProperty('type') || !isString(shift.type) ||
            !['available', 'unavailable', 'event'].includes(shift.type)) {
            validationError(kInterface, 'type');
            return false;
        }

        if (!shift.hasOwnProperty('eventId') || !isNumberOrNull(shift.eventId)) {
            validationError(kInterface, 'eventId');
            return false;
        }

        if (!shift.hasOwnProperty('beginTime') || !isNumber(shift.beginTime)) {
            validationError(kInterface, 'beginTime');
            return false;
        }

        if (!shift.hasOwnProperty('endTime') || !isNumber(shift.endTime)) {
            validationError(kInterface, 'endTime');
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
        const kInterface = 'IVolunteerGroup';

        if (!volunteerGroup.hasOwnProperty('groupToken') || !isString(volunteerGroup.groupToken)) {
            validationError(kInterface, 'groupToken');
            return false;
        }

        if (!volunteerGroup.hasOwnProperty('primary') || !isBoolean(volunteerGroup.primary)) {
            validationError(kInterface, 'primary');
            return false;
        }

        if (!volunteerGroup.hasOwnProperty('label') || !isString(volunteerGroup.label)) {
            validationError(kInterface, 'label');
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
        const kInterface = 'IVolunteerInfo';

        if (!volunteerInfo.hasOwnProperty('userToken') || !isString(volunteerInfo.userToken)) {
            validationError(kInterface, 'userToken');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('groupToken') || !isString(volunteerInfo.groupToken)) {
            validationError(kInterface, 'groupToken');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('name') || !isString(volunteerInfo.name)) {
            validationError(kInterface, 'name');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('avatar') || !isStringOrNull(volunteerInfo.avatar)) {
            validationError(kInterface, 'avatar');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('title') || !isString(volunteerInfo.title)) {
            validationError(kInterface, 'title');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('accessCode') ||
            !isStringOrNull(volunteerInfo.accessCode)) {
            validationError(kInterface, 'accessCode');
            return false;
        }

        if (!volunteerInfo.hasOwnProperty('telephone') ||
            !isStringOrNull(volunteerInfo.telephone)) {
            validationError(kInterface, 'telephone');
            return false;
        }

        return true;
    }

}

export default EventLoader;
