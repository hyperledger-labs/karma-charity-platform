import { Type } from 'class-transformer';

export class File {
    id: number;
    uid: string;
    name: string;
    path: string;
    size: number;

    type: string;
    linkId: number;
    linkType: string;

    mime: string;
    extension: string;

    @Type(() => Date)
    createdDate: Date;

    @Type(() => Date)
    updatedDate: Date;
}

export enum FileLinkType {
    PROJECT = 'PROJECT',
    COMPANY = 'COMPANY',
}

