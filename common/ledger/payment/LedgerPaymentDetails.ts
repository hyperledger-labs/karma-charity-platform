import { IsString, Length, IsOptional } from 'class-validator';

export interface ILedgerPaymentDetails {
    sourceId?: string;
    description?: string;
    transactionId: string;
}

export class LedgerPaymentDetails implements ILedgerPaymentDetails {
    @IsOptional()
    @IsString()
    sourceId?: string;

    @IsOptional()
    @Length(0, 250)
    @IsString()
    description?: string;

    @IsString()
    transactionId: string;
}
