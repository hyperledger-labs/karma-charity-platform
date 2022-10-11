import { ExtendedError } from '@ts-core/common';

export class LedgerError<T = any> extends ExtendedError<T> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(code: LedgerErrorCode, message: string = '', details?: T, isFatal?: boolean) {
        super(message, code, details, isFatal);
    }
}

export enum LedgerErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404
}
