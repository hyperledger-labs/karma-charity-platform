import { TransportCommand } from '@ts-core/common/transport';
import { ITraceable } from '@ts-core/common/trace';

export class BlockParseCommand extends TransportCommand<IBlockParseDto> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'BlockParseCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IBlockParseDto) {
        super(BlockParseCommand.NAME, request);
    }
}

export interface IBlockParseDto extends ITraceable {
    number: number;
}
