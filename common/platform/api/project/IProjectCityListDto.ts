import { ITraceable } from '@ts-core/common';
import { ProjectTag } from '../../project';

export interface IProjectCityListDto extends ITraceable {
    tag: ProjectTag;
}

export type IProjectCityListDtoResponse = Array<string>;
