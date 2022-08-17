import { ITraceable } from '@ts-core/common';
import { File, FileLinkType } from '../../file';

export interface IFileUploadDto extends ITraceable {
    type: string;
    linkId: number;
    linkType: FileLinkType;
    
    mime: string;
    extension: string;
}

export interface IFileBase64UploadDto extends IFileUploadDto {
    data: string;
}

export type IFileUploadDtoResponse = File;
