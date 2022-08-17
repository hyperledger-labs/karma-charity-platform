import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { CompanyUser } from '../../company';

export interface ICompanyUserListDto extends IPaginable<CompanyUser>, ITraceable { }

export interface ICompanyUserListDtoResponse extends IPagination<CompanyUser> { }
