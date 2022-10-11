import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { ProjectUser } from '../../project';

export interface IProjectUserListDto extends IPaginable<ProjectUser>, ITraceable { }

export interface IProjectUserListDtoResponse extends IPagination<ProjectUser> { }
