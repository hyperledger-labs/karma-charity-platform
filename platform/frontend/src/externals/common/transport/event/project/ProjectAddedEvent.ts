import { KarmaLedgerEvent, IKarmaLedgerEventDto, KarmaLedgerEventDefault } from '../KarmaLedgerEvent';

export class ProjectAddedEvent extends KarmaLedgerEventDefault{
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerEvent.PROJECT_ADDED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: IKarmaLedgerEventDto) {
        super(ProjectAddedEvent.NAME, data);
    }
}
