import { ExtendedError } from '@ts-core/common/error';

export enum ErrorCode {
    SPREAD_EXCEED = 'SPREAD_EXCEED',
    SPREAD_INVALID_DATE = 'SPREAD_INVALID_DATE'
}

export class SpreadInvalidDateError<T = { startDate: Date; finishDate: Date; currentDate: Date; date: Date }> extends ExtendedError<T, ErrorCode> {
    constructor(details: T) {
        super('Invalid date', ErrorCode.SPREAD_INVALID_DATE, details);
    }
}
