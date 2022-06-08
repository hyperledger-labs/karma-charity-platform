import { File } from '@project/common/platform/file';
import { TransportCommand } from '@ts-core/common/transport';

export class FileOpenCommand extends TransportCommand<IFileOpenDto> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'FileOpenCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IFileOpenDto) {
        super(FileOpenCommand.NAME, request);
    }
}

export type IFileOpenDto = File;
