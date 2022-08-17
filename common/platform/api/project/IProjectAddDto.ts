
import { ITraceable } from '@ts-core/common';
import { ProjectPreferences, ProjectPurpose } from '../../project';
import { UserProject } from '../../user';

export interface IProjectAddDto extends ITraceable {
    purposes: Array<ProjectPurpose>;
    preferences: Partial<ProjectPreferences>;
}
export declare type IProjectAddDtoResponse = UserProject;
