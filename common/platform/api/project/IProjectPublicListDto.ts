import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { Project, ProjectPreferences } from '../../project';
import { UserProject } from '../../user';

export interface IProjectPublicListDto extends IPaginable<Project, ProjectPreferences>, ITraceable { }

export interface IProjectPublicListDtoResponse extends IPagination<UserProject> { }
