// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Interface that must be supported by objects that wish to observe title updates.
 */
export interface TitleObserver {
    /**
     * Called when the page's current |title| has been updated.
     */
    onTitleUpdate: (title: string | null) => void;
}

/**
 * The TitleManager is responsible for propagating title changes throughout the application. It
 * can be observed for title updates, and notify observers when an update has to happen.
 */
export class TitleManager {
    /**
     * List of observers wishing to receive title updates. Observers are responsible for removing
     * themselves from this list when they're being destroyed.
     */
    private static observers: Set<TitleObserver> = new Set();

    /**
     * Adds the |observer| to the list of observers.
     */
    static addObserver(observer: TitleObserver): void {
        TitleManager.observers.add(observer);
    }

    /**
     * Removes the |observer| from the list of observers.
     */
    static removeObserver(observer: TitleObserver): void {
        TitleManager.observers.delete(observer);
    }

    /**
     * Updates the page's title to |title|. All observers will be immediately informed.
     */
    static setTitle(title: string | null): void {
        for (const observer of TitleManager.observers)
            observer.onTitleUpdate(title);
    }
}
