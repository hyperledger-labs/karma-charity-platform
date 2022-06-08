import { DatabaseModule } from '@project/module/database';
import { Module } from '@nestjs/common';
import { HealthcheckController } from './controller';

@Module({
    imports: [DatabaseModule],
    controllers: [HealthcheckController]
})
export class HealthcheckModule { }
