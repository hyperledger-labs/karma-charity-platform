import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { PaymentModule } from '@project/module/payment';
import { SharedModule } from '@project/module/shared';
import { CloudPaymentsPayController } from './controller';

@Module({
    imports: [SharedModule, PaymentModule, DatabaseModule],
    controllers: [CloudPaymentsPayController],
})
export class CloudPaymentsModule { }