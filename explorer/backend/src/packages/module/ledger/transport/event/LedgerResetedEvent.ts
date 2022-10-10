import { TransportEvent } from '@ts-core/common/transport';

export class LedgerResetedEvent extends TransportEvent<ILedgerResetedDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'LedgerResetedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: ILedgerResetedDto) {
        super(LedgerResetedEvent.NAME, data);
    }
}

export interface ILedgerResetedDto {
    ledgerId: number;
}
