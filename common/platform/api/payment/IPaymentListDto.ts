import { IPaginable, IPagination } from '@ts-core/common/dto';
import { ITraceable } from '@ts-core/common/trace';
import { Payment } from '../../payment';

export interface IPaymentListDto extends IPaginable<Payment>, ITraceable { }

export interface IPaymentListDtoResponse extends IPagination<Payment> { }
