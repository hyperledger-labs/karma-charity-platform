import { IPaginable, IPagination } from '@ts-core/common/dto';
import { ITraceable } from '@ts-core/common/trace';
import { Project } from '../../project';
import { UserProject } from '../../user';

export interface IProjectListDto extends IPaginable<Project>, ITraceable { }

export interface IProjectListDtoResponse extends IPagination<UserProject> { }
