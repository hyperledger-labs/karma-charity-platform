import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { PaymentAggregatorGetController, PaymentGetController, PaymentListController } from './controller';
import { PaymentPayHandler } from './transport/handler/PaymentPayHandler';
import { PaymentService } from './service';

const providers = [PaymentService, PaymentPayHandler]

@Module({
    imports: [SharedModule, DatabaseModule],
    exports: [...providers],
    providers,
    controllers: [PaymentGetController, PaymentListController, PaymentAggregatorGetController],
})
export class PaymentModule { }