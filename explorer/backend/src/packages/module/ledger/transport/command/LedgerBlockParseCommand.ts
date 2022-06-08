import { TransportCommand } from '@ts-core/common/transport';
import { ITraceable } from '@ts-core/common/trace';

export class LedgerBlockParseCommand extends TransportCommand<ILedgerBlockParseDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'LedgerBlockParseCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: ILedgerBlockParseDto) {
        super(LedgerBlockParseCommand.NAME, request);
    }
}

export interface ILedgerBlockParseDto extends ITraceable {
    ledgerId: number;
    isBatch: boolean;
    number: number;
}
