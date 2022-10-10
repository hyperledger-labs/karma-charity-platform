import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { LedgerService } from '../LedgerService';
import { ExtendedError, Logger, Paginable } from '@ts-core/common';

@Injectable()
export class LedgerGuardPaginable implements CanActivate {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private logger: Logger, private service: LedgerService) { }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async validateRequest(request: any): Promise<boolean> {
        let data = request.method === 'GET' ? request.query : request.body;
        data = Paginable.transform(data);

        if (_.isNil(data.conditions)) {
            throw new ExtendedError(`Conditions is nil`);
        }

        let item = await this.service.ledgerGet(data.conditions.ledgerName);
        if (_.isNil(item)) {
            throw new ExtendedError(`Ledger "${data.ledgerName}" not found`);
        }
        delete data.conditions.ledgerName;
        data.conditions.ledgerId = item.id;

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
