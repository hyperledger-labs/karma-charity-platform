import { LedgerObjectType } from "../../ledger";

export interface ILedgerObjectDetails {
    name: string;
    type: LedgerObjectType;
    picture: string;
    description: string;
}