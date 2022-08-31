import { Accounts } from '../../account';

export interface IStatisticsDtoResponse {
    projectsNew: number;
    projectsClosed: number;

    paymentsTotal: number;
    paymentsTotalAmount: Accounts;

    paymentsToday: number;
    paymentsTodayAmount: Accounts;
}
