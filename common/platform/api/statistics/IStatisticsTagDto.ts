import { Accounts } from '../../account';
import { ProjectTag } from '../../project';

export interface IStatisticsTagDto {
    tag: ProjectTag;
}

export interface IStatisticsTagDtoResponse {
    active: number;
    finished: number;
    newWeekly: number;
    paymentsAmount: Accounts;
}

