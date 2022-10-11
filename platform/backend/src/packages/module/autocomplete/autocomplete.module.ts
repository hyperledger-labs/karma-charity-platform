import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { AutocompleteCityController } from './controller';

const providers = []

@Module({
    imports: [SharedModule, DatabaseModule],
    exports: [...providers],
    controllers: [AutocompleteCityController],
    providers,
})
export class AutocompleteModule { }