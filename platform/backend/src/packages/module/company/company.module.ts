import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { NalogModule } from '@project/module/nalog';
import { SharedModule } from '@project/module/shared';
import { CompanyAddController, CompanyEditController, CompanyToVerifyController, CompanyUserRoleSetController, CompanyUserRoleGetController, CompanyListController, CompanyVerifyController, CompanyRejectController, CompanyActivateController, CompanyUserListController, CompanyGetController } from './controller';

@Module({
    imports: [SharedModule, DatabaseModule, NalogModule, LedgerModule],
    controllers: [CompanyUserListController, CompanyEditController, CompanyGetController, CompanyAddController, CompanyToVerifyController, CompanyListController, CompanyRejectController, CompanyVerifyController, CompanyUserRoleGetController, CompanyUserRoleSetController, CompanyActivateController],
})
export class CompanyModule { }