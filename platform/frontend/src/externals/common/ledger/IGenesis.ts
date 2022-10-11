export interface IGenesis {
    rootUserUid: string;
    rootCompanyUid: string;
    createdDate: Date;
}

import { TransportCryptoManagerEd25519 } from "@ts-core/common";
export const ROOT_USER_DESCRIPTION = 'ROOT_USER';
export const ROOT_USER_CRYPTO_ALGORITHM = TransportCryptoManagerEd25519.ALGORITHM;
export const ROOT_USER_CRYPTO_KEY_PUBLIC = 'e365007e85508c6b44d5101a1d59d0061a48fd1bcd393186ccb5e7ae938a59a8';
export const ROOT_USER_CRYPTO_KEY_PRIVATE = 'e87501bc00a3db3ba436f7109198e0cb65c5f929eabcedbbb5a9874abc2c73a3e365007e85508c6b44d5101a1d59d0061a48fd1bcd393186ccb5e7ae938a59a8';

export const ROOT_COMPANY_DESCRIPTION = 'ROOT_COMPANY';
