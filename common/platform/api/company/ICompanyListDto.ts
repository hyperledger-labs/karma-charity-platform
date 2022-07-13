import { IPaginable, IPagination } from '@ts-core/common/dto';
import { ITraceable } from '@ts-core/common/trace';
import { Company } from '../../company';
import { UserCompany } from '../../user';

export interface ICompanyListDto extends IPaginable<Company>, ITraceable { }

export interface ICompanyListDtoResponse extends IPagination<UserCompany> { }
