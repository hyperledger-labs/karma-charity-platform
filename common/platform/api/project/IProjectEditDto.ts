
import { ITraceable } from '@ts-core/common';
import { ProjectPreferences, ProjectPurpose, ProjectStatus } from '../../project';
import { UserProject } from '../../user';

export interface IProjectEditDto extends ITraceable {
    id?: number;
    status?: ProjectStatus;
    purposes?: Array<ProjectPurpose>;
    preferences?: Partial<ProjectPreferences>;
}
export declare type IProjectEditDtoResponse = UserProject;
