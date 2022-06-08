import { ArgumentsHost, Catch, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ExtendedErrorFilter, IExceptionFilter } from '@ts-core/backend-nestjs/middleware';
import { ExtendedError } from '@ts-core/common/error';
import { TransformUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { CoreExtendedError } from './CoreExtendedError';

@Catch(CoreExtendedError)
export class CoreExtendedErrorFilter extends ExtendedErrorFilter {


    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public instanceOf(item: any): boolean {
        return item instanceof CoreExtendedError;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected getStatus(error: ExtendedError | CoreExtendedError): number {
        if (error instanceof CoreExtendedError && !_.isNil(error.status)) {
            return error.status;
        }
        return ExtendedErrorFilter.DEFAULT_ERROR.getStatus();
    }
}
