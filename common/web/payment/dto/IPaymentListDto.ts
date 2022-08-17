import { IPaginable } from '@ts-core/common';
import { IPayment } from '..';

export interface IPaymentListDto extends IPaginable<IPayment> {}
