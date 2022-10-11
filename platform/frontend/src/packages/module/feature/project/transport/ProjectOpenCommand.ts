
import { TransportCommand } from '@ts-core/common';

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
