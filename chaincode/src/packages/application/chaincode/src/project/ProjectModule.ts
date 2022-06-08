import { Module } from '@nestjs/common';
import { ProjectGetHandler } from './handler/ProjectGetHandler';
import { ProjectAddHandler } from './handler/ProjectAddHandler';
import { ProjectListHandler } from './handler/ProjectListHandler';
import { ProjectEditHandler } from './handler/ProjectEditHandler';
import { ProjectRemoveHandler } from './handler/ProjectRemoveHandler';
import { ProjectUserAddHandler } from './handler/ProjectUserAddHandler';
import { ProjectUserEditHandler } from './handler/ProjectUserEditHandler';
import { ProjectUserListHandler } from './handler/ProjectUserListHandler';
import { ProjectUserRemoveHandler } from './handler/ProjectUserRemoveHandler';
import { ProjectUserRoleListHandler } from './handler/ProjectUserRoleListHandler';
import { ProjectService } from './service/ProjectService';

@Module({
    controllers: [
        ProjectListHandler,
        ProjectEditHandler,
        ProjectGetHandler,
        ProjectAddHandler,
        ProjectRemoveHandler,

        ProjectUserAddHandler,
        ProjectUserEditHandler,
        ProjectUserListHandler,
        ProjectUserRemoveHandler,
        ProjectUserRoleListHandler
    ],
    providers: [ProjectService],
    exports: [ProjectService]
})
export class ProjectModule {}
