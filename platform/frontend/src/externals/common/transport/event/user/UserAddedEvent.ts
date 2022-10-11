import { KarmaLedgerEvent, IKarmaLedgerEventDto, KarmaLedgerEventDefault } from '../KarmaLedgerEvent';

export class UserAddedEvent extends KarmaLedgerEventDefault {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerEvent.USER_ADDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: IKarmaLedgerEventDto) {
        super(UserAddedEvent.NAME, data);
    }
}
