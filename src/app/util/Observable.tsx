// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Interface to which an observer must conform.
 */
export interface Observer<T extends any[]> {
    update(...args: T): void;
}

/**
 * The Observable utility class defines a system for attaching observers following a given Interface
 * and being able to dispatch notifications on it.
 */
export class Observable<T extends any[]> {

    /**
     * Set of observers that should receive updates.
     */
    private observers_: Set<Observer<T>> = new Set();

    /**
     * Adds the given |observer| to the list of observers.
     */
    addObserver(observer: Observer<T>): void {
        this.observers_.add(observer);
    }

    /**
     * Removes the given |observer| from the list of observers.
     */
    removeObserver(observer: Observer<T>): void {
        this.observers_.delete(observer);
    }

    /**
     * Notifies the observers of an update.
     */
    notify(...args: T): void {
        for (const observer of this.observers_)
            observer.update(...args);
    }
}
