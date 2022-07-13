import { Module } from '@nestjs/common';
import { CoreModule } from '@project/module/core';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
// import { NalogSearchController } from './controller';
import { LedgerService } from './service';

const providers = [LedgerService]

@Module({
    imports: [SharedModule, DatabaseModule],
    exports: [...providers],
    // controllers: [NalogSearchController],
    providers,
})
export class LedgerModule { }