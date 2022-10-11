import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { UserCompany } from '../../user';
import { Company, CompanyPreferences } from '../../company';

export interface ICompanyPublicListDto extends IPaginable<Company, CompanyPreferences>, ITraceable { }

export interface ICompanyPublicListDtoResponse extends IPagination<UserCompany> { }
