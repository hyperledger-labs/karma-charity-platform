import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { NalogModule } from '@project/module/nalog';
import { SharedModule } from '@project/module/shared';
import { ProjectAddController, ProjectToVerifyController, ProjectUserListController, ProjectGetController, ProjectListController, ProjectVerifyController, ProjectRejectController, ProjectActivateController, ProjectUserRoleGetController, ProjectUserRoleSetController } from './controller';


@Module({
    imports: [SharedModule, DatabaseModule, NalogModule],
    controllers: [ProjectAddController, ProjectUserListController, ProjectGetController, ProjectToVerifyController, ProjectListController, ProjectRejectController, ProjectVerifyController, ProjectActivateController, ProjectUserRoleGetController, ProjectUserRoleSetController],
})
export class ProjectModule { }