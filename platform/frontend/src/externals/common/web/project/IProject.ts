import { ProjectStatus } from './ProjectStatus';

export interface IProject {
    id: number;
    name: string;
    preview?: string;
    location: string;
    shortDescription: string;

    amount: number;
    status: ProjectStatus;
    companyId: number;
    collectedAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProjectExtended extends IProject {
    creatorId: number;
    description: string;
    ledgerUid?: string;
}
