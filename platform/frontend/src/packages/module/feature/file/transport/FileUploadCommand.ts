import { File } from '@project/common/platform/file';
import { TransportCommandAsync } from '@ts-core/common/transport';

export class FileUploadCommand extends TransportCommandAsync<IFileUploadDto, IFileUploadDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'FileUploadCommand';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: IFileUploadDto) {
        super(FileUploadCommand.NAME, request);
    }
}

export interface IFileUploadDto {
    linkId: number;
    linkType: string;
    types: Array<string>; 

    files?: Array<File>;
    allowExtensions?: Array<string>
}
export type IFileUploadDtoResponse = boolean;
