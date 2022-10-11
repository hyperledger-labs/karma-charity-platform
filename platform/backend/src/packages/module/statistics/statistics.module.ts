import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { StatisticsGetController } from './controller';

const providers = []

@Module({
    imports: [SharedModule, DatabaseModule],
    exports: [...providers],
    controllers: [StatisticsGetController],
    providers,
})
export class StatisticsModule { }