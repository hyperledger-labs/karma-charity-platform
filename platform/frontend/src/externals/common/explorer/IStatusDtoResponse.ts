export interface IStatusDtoResponse {
    blockHeight: number;
    blockHeightParsed: number;
    blocksUnparsed: Array<number>;
    ledger: {
        id: number;
        url: string;
        name: string;
        blockLast: number;
    };
}
