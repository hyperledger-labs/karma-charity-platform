import { KarmaLedgerEvent, IKarmaLedgerEventDto, KarmaLedgerEventDefault } from '../KarmaLedgerEvent';

export class CompanyAddedEvent extends KarmaLedgerEventDefault {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerEvent.COMPANY_ADDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: IKarmaLedgerEventDto) {
        super(CompanyAddedEvent.NAME, data);
    }
}
