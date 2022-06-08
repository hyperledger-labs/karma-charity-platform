import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { BlocksOpenCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class BlocksOpenHandler extends TransportCommandHandler<void, BlocksOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private router: RouterService) {
        super(logger, transport, BlocksOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        this.router.blocksOpen();
    }
}
