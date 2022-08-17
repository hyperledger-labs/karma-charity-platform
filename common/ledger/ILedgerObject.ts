import { LedgerUser } from './user';
import { LedgerProject } from './project';
import { LedgerCompany } from './company';
import { UID, IUIDable, getUid } from '@ts-core/common';

export interface ILedgerObject extends IUIDable { }

export enum LedgerObjectType {
    USER = 'USER',
    COMPANY = 'COMPANY',
    PROJECT = 'PROJECT',
}

export function IsUser(uid: UID): boolean {
    return LedgerUser.UID_REGXP.test(getUid(uid));
}

export function IsCompany(uid: UID): boolean {
    return LedgerCompany.UID_REGXP.test(getUid(uid));
}

export function IsProject(uid: UID): boolean {
    return LedgerProject.UID_REGXP.test(getUid(uid));
}

export function getType(uid: UID): LedgerObjectType {
    if (IsUser(uid)) {
        return LedgerObjectType.USER;
    }
    if (IsCompany(uid)) {
        return LedgerObjectType.COMPANY;
    }
    if (IsProject(uid)) {
        return LedgerObjectType.PROJECT;
    }
    return null;
}



