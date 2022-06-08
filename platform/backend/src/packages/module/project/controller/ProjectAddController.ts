import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { ExtendedError } from '@ts-core/common/error';
import { Logger } from '@ts-core/common/logger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { ObjectUtil, ValidateUtil } from '@ts-core/common/util';
import { UserType } from '@project/common/platform/user';
import { COMPANY_URL, PROJECT_URL } from '@project/common/platform/api';
import { IProjectAddDto, IProjectAddDtoResponse } from '@project/common/platform/api/project';
import { Project, ProjectPreferences, ProjectStatus } from '@project/common/platform/project';
import { ProjectEntity, ProjectPreferencesEntity } from '@project/module/database/project';
import { NalogService } from '@project/module/nalog/service';
import { LedgerCompanyRole, LedgerProjectRole } from '@project/common/ledger/role';
import { RequestInvalidError } from '@project/module/core/middleware';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class ProjectAddDto implements IProjectAddDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsDefined()
    preferences: Partial<ProjectPreferences>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(PROJECT_URL)
export class ProjectAddController extends DefaultController<IProjectAddDto, IProjectAddDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Project add', response: Project })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER],
        company: {
            required: true,
            role: [LedgerCompanyRole.PROJECT_MANAGER]
        }
    })
    public async executeExtended(@Body() params: ProjectAddDto, @Req() request: IUserHolder): Promise<IProjectAddDtoResponse> {
        let user = request.user;
        let company = request.company;

        let project = new ProjectEntity();
        project.status = ProjectStatus.DRAFT;
        project.preferences = new ProjectPreferencesEntity(params.preferences);

        project.userId = user.id;
        project.companyId = company.id;

        await this.database.getConnection().transaction(async manager => {
            let userRepository = manager.getRepository(UserEntity);
            let projectRepository = manager.getRepository(ProjectEntity);
            let userRoleRepository = manager.getRepository(UserRoleEntity);

            ValidateUtil.validate(project);
            project = await projectRepository.save(project);

            ValidateUtil.validate(user);
            await userRepository.save(user);

            project.userRoles = [];
            for (let role of Object.values(LedgerProjectRole)) {
                let item = new UserRoleEntity(user.id, role, null, project.id);

                ValidateUtil.validate(item);
                await userRoleRepository.save(item);
                project.userRoles.push(item);
            }
        });
        return project.toUserObject();
    }
}
