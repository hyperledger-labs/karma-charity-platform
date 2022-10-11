import { ITraceable } from '@ts-core/common';
import { ProjectTag } from '../../project';

export interface IProjectTagListDto extends ITraceable {
    city: string;
}

export type IProjectTagListDtoResponse = Array<ProjectTag>;
