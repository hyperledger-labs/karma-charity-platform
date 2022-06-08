
import { TransportCommand } from '@ts-core/common/transport';

export class CompanyOpenCommand extends TransportCommand<number> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'CompanyOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: number) {
        super(CompanyOpenCommand.NAME, request);
    }
}
