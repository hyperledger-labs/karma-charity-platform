import { Logger } from '@ts-core/common/logger';
import { Injectable } from '@nestjs/common';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { PaymentPayCommand, IPaymentPayDto } from '../PaymentPayCommand';
import { PaymentEntity } from '@project/module/database/payment';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { CoinObjectType } from '@project/common/transport/command/coin';
import { UnreachableStatementError } from '@ts-core/common/error';
import { DatabaseService } from '@project/module/database/service';
import { CloudPaymentsCurrency } from '@project/common/platform/payment/aggregator/cloudpayments';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { ProjectNotFoundError } from '@project/module/core/middleware';

@Injectable()
export class PaymentPayHandler extends TransportCommandHandler<IPaymentPayDto, PaymentPayCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService) {
        super(logger, transport, PaymentPayCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IPaymentPayDto): Promise<void> {
        let item = new PaymentEntity();
        item.type = params.type;
        item.status = params.status;
        item.details = JSON.stringify(params.data);
        item.transactionId = params.transactionId;

        if (!_.isNil(params.details.userId)) {
            item.userId = params.details.userId;
        }

        switch (params.type) {
            case PaymentAggregatorType.CLOUD_PAYMENTS:
                let details = params.data as any;
                item.amount = details.PaymentAmount;
                switch (details.PaymentCurrency) {
                    case CloudPaymentsCurrency.RUB:
                        item.currency = LedgerCoinId.RUR;
                        break;
                }
                break;
        }

        switch (params.details.target.type) {
            case CoinObjectType.COMPANY:
                item.companyId = params.details.target.id;
                break;
            case CoinObjectType.PROJECT:
                let project = await this.database.projectGet(params.details.target.id);
                if (_.isNil(project)) {
                    throw new ProjectNotFoundError();
                }
                item.projectId = project.id;
                item.companyId = project.companyId;
                break;
            default:
                throw new UnreachableStatementError(params.details.target.type);
        }
        await this.database.paymentSave(item);
    }
}
