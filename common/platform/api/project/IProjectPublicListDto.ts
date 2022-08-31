import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { Project, ProjectPreferences } from '../../project';

export interface IProjectPublicListDto extends IPaginable<Project, ProjectPreferences>, ITraceable { }

export interface IProjectPublicListDtoResponse extends IPagination<Project> { }
