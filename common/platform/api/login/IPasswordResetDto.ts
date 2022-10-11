import { ITraceable } from '@ts-core/common';

export interface IPasswordResetDto extends ITraceable {
    email: string;
}
// TODO: must return void
export type IPasswordResetDtoResponse = string;
