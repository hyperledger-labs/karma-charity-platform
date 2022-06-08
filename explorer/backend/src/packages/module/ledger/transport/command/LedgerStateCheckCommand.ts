import { TransportCommand } from '@ts-core/common/transport';
import { ITraceable } from '@ts-core/common/trace';

export class LedgerStateCheckCommand extends TransportCommand<ILedgerStateCheckDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'LedgerStateCheckCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ILedgerStateCheckDto) {
        super(LedgerStateCheckCommand.NAME, request);
    }
}

export interface ILedgerStateCheckDto extends ITraceable {
    ledgerId: number;
}
