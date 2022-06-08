import { ICompany } from '../company/ICompany';
import { IPagination } from '@ts-core/common/dto';

export interface ICompanyList extends IPagination<ICompany> {}
