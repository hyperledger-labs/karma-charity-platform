import { IsString, Length, IsOptional } from 'class-validator';

export interface ILedgerPaymentDetails {
    transactionId: string;
    description?: string;
}

export class LedgerPaymentDetails implements ILedgerPaymentDetails {
    @IsString()
    transactionId: string;

    @IsOptional()
    @Length(0, 250)
    @IsString()
    description?: string;
}
