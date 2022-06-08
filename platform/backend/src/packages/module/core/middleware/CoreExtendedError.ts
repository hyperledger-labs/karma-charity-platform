
import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';
import { ErrorCode } from '@project/common/platform/api';

export class CoreExtendedError<T = void> extends ExtendedError<T, ErrorCode> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(code: ErrorCode, details?: T, public status?: number) {
        super('', code, details);
        this.message = this.constructor.name;
    }
}
