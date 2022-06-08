import { TransportCommand } from '@ts-core/common/transport';
import { UID } from '@ts-core/common/dto';

export class ObjectUpdateCommand extends TransportCommand<UID> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'ObjectUpdateCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: UID) {
        super(ObjectUpdateCommand.NAME, request);
    }
}
