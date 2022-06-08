import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { UserEditController, UserGetController, UserListController, UserTypeController } from './controller';

@Module({
    imports: [SharedModule, DatabaseModule],
    controllers: [UserGetController, UserListController, UserEditController, UserTypeController],
})
export class UserModule { }