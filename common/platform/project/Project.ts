import { Type } from 'class-transformer';
import { ProjectStatus } from './ProjectStatus';
import { ProjectPreferences } from './ProjectPreferences';
import { User } from '../user';
import { Company } from '../company';
import { Accounts } from '../account';
import { ProjectPurpose } from './ProjectPurpose';

export class Project {
    id: number;
    status: ProjectStatus;
    balance: IProjectBalance;

    @Type(() => ProjectPurpose)
    purposes: Array<ProjectPurpose>;

    ledgerUid?: string;
    paymentsAmount?: number;

    userId: number;
    companyId: number;

    @Type(() => Date)
    createdDate: Date;

    @Type(() => Date)
    updatedDate: Date;

    @Type(() => ProjectPreferences)
    preferences: ProjectPreferences;

    user?: User;
    company?: Company;
}

export interface IProjectBalance {
    required: Accounts,
    collected: Accounts,
}

