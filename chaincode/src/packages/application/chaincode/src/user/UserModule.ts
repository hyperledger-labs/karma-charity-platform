import { Module, Global } from '@nestjs/common';
import { UserService } from './service/UserService';
import { UserGetHandler } from './handler/UserGetHandler';
import { UserAddHandler } from './handler/UserAddHandler';
import { UserListHandler } from './handler/UserListHandler';
import { UserRemoveHandler } from './handler/UserRemoveHandler';
import { UserCryptoKeyChangeHandler } from './handler/UserCryptoKeyChangeHandler';
import { UserEditHandler } from './handler/UserEditHandler';
import { UserProjectListHandler } from './handler/UserProjectListHandler';
import { UserCompanyListHandler } from './handler/UserCompanyListHandler';

@Module({
    controllers: [
        UserGetHandler,
        UserAddHandler,
        UserListHandler,
        UserEditHandler,
        UserRemoveHandler,
        UserCompanyListHandler,
        UserProjectListHandler,
        UserCryptoKeyChangeHandler,
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
