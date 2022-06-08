import { IPayment } from '.';
import { IPagination } from '@ts-core/common/dto';

export interface IPaymentList extends IPagination<IPayment> {}
