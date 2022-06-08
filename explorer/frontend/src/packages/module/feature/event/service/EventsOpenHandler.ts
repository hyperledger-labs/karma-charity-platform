import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { EventsOpenCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class EventsOpenHandler extends TransportCommandHandler<void, EventsOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private router: RouterService) {
        super(logger, transport, EventsOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        this.router.eventsOpen();
    }
}
