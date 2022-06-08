import { ITraceable } from '@ts-core/common/trace';
import { User } from '../../user';

export interface IInitDto extends ITraceable {}

export interface IInitDtoResponse {
    user: User;
}
