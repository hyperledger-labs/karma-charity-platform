import { IPaginable } from '@ts-core/common/dto';
import { IPayment } from '..';

export interface IPaymentListDto extends IPaginable<IPayment> {}
