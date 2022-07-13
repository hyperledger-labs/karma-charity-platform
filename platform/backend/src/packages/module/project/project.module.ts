import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { LedgerModule } from '@project/module/ledger';
import { NalogModule } from '@project/module/nalog';
import { SharedModule } from '@project/module/shared';
import { ProjectAddController, ProjectEditController, ProjectToVerifyController, ProjectUserListController, ProjectGetController, ProjectListController, ProjectVerifyController, ProjectRejectController, ProjectActivateController, ProjectUserRoleGetController, ProjectUserRoleSetController } from './controller';
import { ProjectCollectedCheckHandler } from './transport/handler/ProjectCollectedCheckHandler';

const providers = [ProjectCollectedCheckHandler]

@Module({
    imports: [SharedModule, DatabaseModule, NalogModule, LedgerModule],
    controllers: [ProjectAddController, ProjectEditController, ProjectUserListController, ProjectGetController, ProjectToVerifyController, ProjectListController, ProjectRejectController, ProjectVerifyController, ProjectActivateController, ProjectUserRoleGetController, ProjectUserRoleSetController],
    exports: [...providers],
    providers,
})
export class ProjectModule { }