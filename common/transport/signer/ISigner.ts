import { IKeyAsymmetric } from "@ts-core/common/crypto";
import { IUIDable } from "@ts-core/common/dto";

export interface ISigner extends IUIDable {
    key: IKeyAsymmetric;
    name?: string;
    algorithm: string;
}