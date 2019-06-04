// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { ScheduleNotifier } from '../state/ScheduleNotifier';

/**
 * Scope of the pages that should be controlled by the Service Worker.
 * TODO: Should this rely on some publicUrl environment variable?
 */
const kScriptScope = '/';

/**
 * URL of the Service Worker script. Must be relative to the |kScriptScope|.
 */
const kScriptUrl = `${kScriptScope}service-worker.js`;

/**
 * The volunteer portal is controlled by a Service Worker to enable offline functionality. The
 * rules for this are defined in config-overrides.js checked in to the repository.
 */
export class ServiceWorkerManager {
    /**
     * Whether the Service Worker infrastructure is available.
     */
    available_: boolean;

    /**
     * A Promise providing access to the ServiceWorkerRegistration instance that the portal will
     * be controlled by.
     */
    registrationPromise_: Promise<ServiceWorkerRegistration>;

    constructor() {
        this.available_ = 'serviceWorker' in navigator;

        if (this.available_) {
            this.registrationPromise_ = navigator.serviceWorker.ready;
            this.registrationPromise_.then(registration => {
                console.info('This page is controlled by a service worker.', registration);
            });
        } else {
            this.registrationPromise_ = new Promise(resolve => {});
        }
    }

    /**
     * Registers the Service Worker that will be controlling the volunteer portal. Should be called
     * at page load time regardless of whether the user is identified.
     */
    async register(): Promise<void> {
        if (!this.available_)
            return;

        try {
            const registration = await navigator.serviceWorker.register(kScriptUrl, {
                scope: kScriptScope,
            });

            registration.addEventListener('updatefound', () => {
                const installingWorker = registration.installing;
                if (!installingWorker)
                    return;

                installingWorker.addEventListener('statechange', () => {
                    if (navigator.serviceWorker.controller)
                        ScheduleNotifier.notify();
                })
            });
        } catch (e) {
            console.error('Unable to register a service worker.', e);
        }
    }

    /**
     * Removes the controlling Service Worker from the page. This will move the worker to the
     * "redundant" state, ergo the page must be reloaded for this to take effect.
     */
    async unregister(): Promise<void> {
        if (!this.available_)
            return;

        const registration = await this.registrationPromise_;
        if (registration)
            registration.unregister();
    }

    /**
     * Gets a promise that, once resolved, will provide access to the ServiceWorkerRegistration of
     * the Service Worker that controls the volunteer portal.
     */
    get registrationPromise(): Promise<ServiceWorkerRegistration> {
        return this.registrationPromise_;
    }
}
