import { IPayment } from '.';
import { IPagination } from '@ts-core/common';

export interface IPaymentList extends IPagination<IPayment> {}
