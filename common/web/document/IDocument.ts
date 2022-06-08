import { IPagination } from '@ts-core/common/dto';

export interface IDocument {
    name: string;
    path: string;
    extention: string;
}

export type IDocumentList = IPagination<IDocument>;
