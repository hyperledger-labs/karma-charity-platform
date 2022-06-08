import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { NalogSearchController } from './controller';
import { NalogService } from './service';

const providers = [NalogService]

@Module({
    imports: [SharedModule, DatabaseModule],
    exports: [...providers],
    controllers: [NalogSearchController],
    providers,
})
export class NalogModule { }