import { KarmaLedgerEvent, IKarmaLedgerEventDto, KarmaLedgerEventDefault } from '../KarmaLedgerEvent';

export class ProjectUserRemovedEvent extends KarmaLedgerEventDefault {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = KarmaLedgerEvent.PROJECT_USER_REMOVED;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data: IKarmaLedgerEventDto) {
        super(ProjectUserRemovedEvent.NAME, data);
    }
}
