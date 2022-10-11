
import { TransportCommand } from '@ts-core/common';

export class PaymentOpenCommand extends TransportCommand<number> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'PaymentOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: number) {
        super(PaymentOpenCommand.NAME, request);
    }
}
