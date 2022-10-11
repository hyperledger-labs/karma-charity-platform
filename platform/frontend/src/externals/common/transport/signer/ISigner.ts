import { IKeyAsymmetric } from "@ts-core/common";
import { IUIDable } from "@ts-core/common";

export interface ISigner extends IUIDable {
    key: IKeyAsymmetric;
    name?: string;
    algorithm: string;
}