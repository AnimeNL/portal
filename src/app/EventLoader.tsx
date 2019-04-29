// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IEvent } from './api/IEvent';
import { IVolunteerInfo } from './api/IVolunteerInfo';
import { IVolunteerGroup } from './api/IVolunteerGroup';
import { EventPath, mockableFetch } from '../config';
import { isBoolean, isString, isStringOrNull } from './util/Validators';

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
