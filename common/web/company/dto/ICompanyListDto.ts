import { IPaginable } from '@ts-core/common/dto';
import { ICompany } from '../ICompany';

export interface ICompanyListDto extends IPaginable<ICompany> {}
