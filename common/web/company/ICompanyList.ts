import { ICompany } from '../company/ICompany';
import { IPagination } from '@ts-core/common';

export interface ICompanyList extends IPagination<ICompany> {}
