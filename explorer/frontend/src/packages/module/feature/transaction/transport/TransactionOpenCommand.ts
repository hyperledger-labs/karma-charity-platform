import { LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { TransportCommand } from '@ts-core/common/transport';

export class TransactionOpenCommand extends TransportCommand<ITransactionOpenDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'TransactionOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ITransactionOpenDto) {
        super(TransactionOpenCommand.NAME, request);
    }
}

export type ITransactionOpenDto = LedgerBlockTransaction | string;
