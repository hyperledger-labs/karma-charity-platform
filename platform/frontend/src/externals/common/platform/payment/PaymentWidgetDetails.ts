
import { IsOptional, IsObject, IsBoolean, IsString, IsNumber } from 'class-validator';

export class PaymentWidgetDetails<T = any> {
    @IsOptional()
    @IsBoolean()
    isWaitCallback?: boolean;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsNumber({}, { each: true })
    amounts?: Array<number>;

    @IsOptional()
    @IsString()
    coinId?: string;

    @IsOptional()
    @IsString({ each: true })
    coinIds?: Array<string>;

    @IsOptional()
    @IsObject()
    data?: T;
}
