import { KarmaLedgerEvent, IKarmaLedgerEventDto, KarmaLedgerEventDefault } from '../KarmaLedgerEvent';

export class CompanyRemovedEvent extends KarmaLedgerEventDefault {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerEvent.COMPANY_REMOVED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: IKarmaLedgerEventDto) {
        super(CompanyRemovedEvent.NAME, data);
    }
}
