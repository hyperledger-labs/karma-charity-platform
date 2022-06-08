import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { EventOpenCommand, IEventOpenDto } from '../transport';

@Injectable({ providedIn: 'root' })
export class EventOpenHandler extends TransportCommandHandler<IEventOpenDto, EventOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private router: RouterService) {
        super(logger, transport, EventOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IEventOpenDto): Promise<void> {
        this.router.eventOpen(params);
    }
}
