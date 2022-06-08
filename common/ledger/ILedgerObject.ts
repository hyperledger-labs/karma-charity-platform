import { LedgerUser } from './user';
import { LedgerProject } from './project';
import { LedgerCompany } from './company';
import { UID, IUIDable, getUid } from '@ts-core/common/dto';

export interface ILedgerObject extends IUIDable {}

export function IsUser(uid: UID): boolean {
    return LedgerUser.UID_REGXP.test(getUid(uid));
}

export function IsCompany(uid: UID): boolean {
    return LedgerCompany.UID_REGXP.test(getUid(uid));
}

export function IsProject(uid: UID): boolean {
    return LedgerProject.UID_REGXP.test(getUid(uid));
}
