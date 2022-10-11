export interface ITransferCreateDto {
    amount: number;

    fromId: number;
    fromType: string;

    toId: number;
    toType: string;
}
