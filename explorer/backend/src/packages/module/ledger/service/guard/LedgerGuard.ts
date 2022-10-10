import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Logger, ExtendedError } from '@ts-core/common';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { LedgerService } from '../LedgerService';
import { Ledger } from '@hlf-explorer/common';

@Injectable()
export class LedgerGuard implements CanActivate {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private logger: Logger, private service: LedgerService) {}

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async validateRequest(request: any): Promise<boolean> {
        let data = request.method === 'GET' ? request.query : request.body;
        let item = await this.service.ledgerGet(data.ledgerName);
        if (_.isNil(item)) {
            throw new ExtendedError(`Ledger "${data.ledgerName}" not found`);
        }
        request['ledger'] = item;
        return true;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return this.validateRequest(context.switchToHttp().getRequest());
    }
}

export interface ILedgerHolder {
    ledger: Ledger;
}
