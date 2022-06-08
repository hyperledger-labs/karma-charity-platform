import { TransportCommand } from '@ts-core/common/transport';
import { ITraceable } from '@ts-core/common/trace';

export class LedgerBatchCommand extends TransportCommand<ILedgerBatchDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'LedgerBatchCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ILedgerBatchDto) {
        super(LedgerBatchCommand.NAME, request);
    }
}

export interface ILedgerBatchDto extends ITraceable {
    ledgerId: number;
}
