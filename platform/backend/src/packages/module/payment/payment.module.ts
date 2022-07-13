import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { PaymentAggregatorGetController, PaymentGetByReferenceController, PaymentGetController, PaymentListController, PaymentTransactionListController } from './controller';
import { PaymentPayHandler } from './transport/handler/PaymentPayHandler';
import { PaymentService } from './service';
import { LedgerModule } from '@project/module/ledger';

const providers = [PaymentService, PaymentPayHandler]

@Module({
    imports: [SharedModule, DatabaseModule, LedgerModule],
    exports: [...providers],
    providers,
    controllers: [PaymentTransactionListController, PaymentGetController, PaymentGetByReferenceController, PaymentListController, PaymentAggregatorGetController],
})
export class PaymentModule { }