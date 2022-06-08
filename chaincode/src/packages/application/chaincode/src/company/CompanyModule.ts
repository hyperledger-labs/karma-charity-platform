import { Module } from '@nestjs/common';
import { CompanyService } from './service/CompanyService';
import { CompanyGetHandler } from './handler/CompanyGetHandler';
import { CompanyAddHandler } from './handler/CompanyAddHandler';
import { CompanyListHandler } from './handler/CompanyListHandler';
import { CompanyRemoveHandler } from './handler/CompanyRemoveHandler';
import { CompanyUserAddHandler } from './handler/CompanyUserAddHandler';
import { CompanyEditHandler } from './handler/CompanyEditHandler';
import { CompanyUserListHandler } from './handler/CompanyUserListHandler';
import { CompanyUserEditHandler } from './handler/CompanyUserEditHandler';
import { CompanyUserRemoveHandler } from './handler/CompanyUserRemoveHandler';
import { CompanyUserRoleListHandler } from './handler/CompanyUserRoleListHandler';
import { CompanyProjectListHandler } from './handler/CompanyProjectListHandler';

@Module({
    controllers: [
        CompanyGetHandler,
        CompanyListHandler,
        CompanyAddHandler,
        CompanyEditHandler,
        CompanyRemoveHandler,
        CompanyProjectListHandler,

        CompanyUserAddHandler,
        CompanyUserListHandler,
        CompanyUserRemoveHandler,
        CompanyUserEditHandler,
        CompanyUserRoleListHandler
    ],
    providers: [CompanyService],
    exports: [CompanyService]
})
export class CompanyModule {}
