import { IPaginable, IPagination } from '@ts-core/common';
import { ITraceable } from '@ts-core/common';
import { Payment, PaymentTransaction } from '../../payment';

export interface IPaymentPublicListDto extends IPaginable<Payment, PaymentTransaction>, ITraceable { }

export interface IPaymentPublicListDtoResponse extends IPagination<Payment> { }
