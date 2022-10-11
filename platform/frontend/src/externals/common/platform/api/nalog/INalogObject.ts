import { Type } from 'class-transformer';

export class INalogObject {
    ceo: string;
    inn: string;
    kpp: string;
    ogrn: string;
    name: string;
    address: string;
    nameShort: string;

    @Type(() => Date)
    founded: Date;
}