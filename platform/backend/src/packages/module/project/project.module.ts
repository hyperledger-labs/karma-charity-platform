import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { NalogModule } from '@project/module/nalog';
import { SharedModule } from '@project/module/shared';
import { ProjectAddController, ProjectEditController, ProjectCityListController, ProjectTagListController, ProjectReportSubmitController, ProjectPublicListController, ProjectToVerifyController, ProjectUserListController, ProjectGetController, ProjectListController, ProjectVerifyController, ProjectRejectController, ProjectActivateController, ProjectUserRoleGetController, ProjectUserRoleSetController, ProjectPaymentTransactionListController } from './controller';
import { ProjectCollectedCheckHandler } from './transport/handler/ProjectCollectedCheckHandler';

const providers = [ProjectCollectedCheckHandler]

@Module({
    imports: [SharedModule, DatabaseModule, NalogModule, LedgerModule],
    controllers: [ProjectAddController, ProjectCityListController, ProjectTagListController, ProjectPublicListController, ProjectReportSubmitController, ProjectEditController, ProjectUserListController, ProjectGetController, ProjectToVerifyController, ProjectListController, ProjectRejectController, ProjectVerifyController, ProjectActivateController, ProjectUserRoleGetController, ProjectUserRoleSetController, ProjectPaymentTransactionListController],
    exports: [...providers],
    providers,
})
export class ProjectModule { }