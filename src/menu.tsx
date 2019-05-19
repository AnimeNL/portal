// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

/**
 * Interface that must be supported by objects that wish to observe menu state updates.
 */
export interface MenuObserver {
    /**
     * Called when the menu's visibility should be toggled.
     */
    onMenuToggle: (open: boolean) => void;
}

/**
 * The MenuNotifier is responsible for propagating menu state change requests.
 */
export class MenuNotifier {
    /**
     * List of observers wishing to receive menu state updates. Observers are responsible for
     * removing themselves from this list when they're being destroyed.
     */
    private static observers: Set<MenuObserver> = new Set();

    /**
     * Adds the |observer| to the list of observers.
     */
    static addObserver(observer: MenuObserver): void {
        MenuNotifier.observers.add(observer);
    }

    /**
     * Removes the |observer| from the list of observers.
     */
    static removeObserver(observer: MenuObserver): void {
        MenuNotifier.observers.delete(observer);
    }

    /**
     * Requests the page's menu state to close.
     */
    static closeMenu(): void {
        for (const observer of MenuNotifier.observers)
            observer.onMenuToggle(/* open= */ false);
    }

    /**
     * Requests the page's menu state to open.
     */
    static openMenu(): void {
        for (const observer of MenuNotifier.observers)
            observer.onMenuToggle(/* open= */ true);
    }
}
