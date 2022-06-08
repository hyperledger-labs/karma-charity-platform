
import { TransportCommand } from '@ts-core/common/transport';

export class ProjectOpenCommand extends TransportCommand<number> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ProjectOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: number) {
        super(ProjectOpenCommand.NAME, request);
    }
}
