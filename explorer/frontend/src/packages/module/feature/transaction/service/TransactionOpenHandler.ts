import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { RouterService } from '@core/service';
import { TransactionOpenCommand, ITransactionOpenDto } from '../transport';

@Injectable({ providedIn: 'root' })
export class TransactionOpenHandler extends TransportCommandHandler<ITransactionOpenDto, TransactionOpenCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private router: RouterService) {
        super(logger, transport, TransactionOpenCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: ITransactionOpenDto): Promise<void> {
        this.router.transactionOpen(params);
    }
}
