import { ITraceable } from '@ts-core/common';

export interface IRegisterDto extends ITraceable { 
    email: string;
    password: string;
}
