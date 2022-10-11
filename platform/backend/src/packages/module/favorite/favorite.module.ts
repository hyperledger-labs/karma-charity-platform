import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { FavoriteListController, FavoriteRemoveController, FavoriteAddController } from './controller';

const providers = []

@Module({
    imports: [SharedModule, DatabaseModule],
    exports: [...providers],
    controllers: [FavoriteAddController, FavoriteRemoveController, FavoriteListController],
    providers,
})
export class FavoriteModule { }