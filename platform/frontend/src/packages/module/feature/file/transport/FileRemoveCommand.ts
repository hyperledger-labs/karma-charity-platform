import { File } from '@project/common/platform/file';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class FileRemoveCommand extends TransportCommandAsync<IFileRemoveDto, IFileRemoveDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'FileRemoveCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IFileRemoveDto) {
        super(FileRemoveCommand.NAME, request);
    }
}

export type IFileRemoveDto = number;
export type IFileRemoveDtoResponse = File;
