import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { TransactionsOpenCommand } from '../transport';

@Injectable({ providedIn: 'root' })
export class TransactionsOpenHandler extends TransportCommandHandler<void, TransactionsOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private router: RouterService) {
        super(logger, transport, TransactionsOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(): Promise<void> {
        this.router.transactionsOpen();
    }
}
