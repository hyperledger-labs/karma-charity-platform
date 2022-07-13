import { IPaginable, IPagination } from '@ts-core/common/dto';
import { ITraceable } from '@ts-core/common/trace';
import { PaymentTransaction } from '../../payment';

export interface IPaymentTransactionListDto extends IPaginable<PaymentTransaction>, ITraceable { }

export interface IPaymentTransactionListDtoResponse extends IPagination<PaymentTransaction> { }
