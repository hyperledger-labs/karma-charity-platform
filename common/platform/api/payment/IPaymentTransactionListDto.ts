import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { CompanyPreferences } from '../../company';
import { PaymentTransaction } from '../../payment';
import { ProjectPreferences } from '../../project';

export type IPaymentTransactionTarget = Partial<CompanyPreferences> & Partial<ProjectPreferences>;

export interface IPaymentTransactionListDto extends IPaginable<PaymentTransaction, IPaymentTransactionTarget>, ITraceable { }

export interface IPaymentTransactionListDtoResponse extends IPagination<PaymentTransaction> { }
