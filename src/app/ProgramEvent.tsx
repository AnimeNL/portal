// Copyright 2019 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { IProgramEvent } from './api/IProgramEvent';
import { ProgramSession } from './ProgramSession';
import { Shift } from './Shift';

/**
 * Represents an event that's included on the program.
 */
export class ProgramEvent {
    info: IProgramEvent;
    sessions_: ProgramSession[];
    shifts_: Shift[] = [];

    constructor(info: IProgramEvent, sessions: ProgramSession[]) {
        this.info = info;
        this.sessions_ = sessions;
    }

    /**
     * Adds the given |shift| to the list of shifts associated with this event.
     */
    addShift(shift: Shift): void {
        this.shifts_.push(shift);
    }

    /**
     * Id (number) of the event. Must be unique.
     */
    get id(): number {
        return this.info.id;
    }

    /**
     * Whether this event is internal to the conference and not publicly announced.
     */
    get internal(): boolean {
        return this.info.internal;
    }

    /**
     * Array detailing the sessions that are part of this event.
     */
    get sessions(): ProgramSession[] {
        return this.sessions_;
    }

    /**
     * Gets ths shifts that are associated with this event.
     */
    get shifts(): Shift[] {
        return this.shifts_;
    }
}
