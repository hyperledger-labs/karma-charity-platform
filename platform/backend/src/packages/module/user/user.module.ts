import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { SharedModule } from '@project/module/shared';
import { UserEditController, UserGetController, UserFindController, UserListController, UserTypeController } from './controller';

@Module({
    imports: [SharedModule, DatabaseModule, LedgerModule],
    controllers: [UserGetController, UserListController, UserFindController, UserEditController, UserTypeController],
})
export class UserModule { }