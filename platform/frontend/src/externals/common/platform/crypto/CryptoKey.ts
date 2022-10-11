import { IKeyAsymmetric } from '@ts-core/common';

export class CryptoKey implements IKeyAsymmetric {
    status: CryptoKeyStatus;
    algorithm: string;
    publicKey: string;
    privateKey: string;
}

export enum CryptoKeyType {
    DATABASE = 'DATABASE'
}

export enum CryptoKeyStatus {
    ACTIVE = 'ACTIVE',
    NOT_ACTIVE = 'NOT_ACTIVE'
}
