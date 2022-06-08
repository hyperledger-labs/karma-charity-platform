import { Controller, Get, ParseIntPipe, Param, Req, UseGuards, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common/dto';
import { Logger } from '@ts-core/common/logger';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { UserProject, UserType } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder, UserEntity } from '@project/module/database/user';
import { ProjectUser } from '@project/common/platform/project';
import { LedgerProjectRole } from '@project/common/ledger/role';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ProjectUserListDto implements Paginable<ProjectUser> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<ProjectUser>;

    @ApiPropertyOptional()
    sort?: FilterableSort<UserProject>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class ProjectUserListDtoResponse implements IPagination<ProjectUser> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: ProjectUser })
    items: Array<ProjectUser>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${PROJECT_URL}/:id/user`)
export class ProjectUserListController extends DefaultController<ProjectUserListDto, ProjectUserListDtoResponse> {
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

    @Swagger({ name: 'Get project users list', response: ProjectUserListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER]
    })
    public async executeExtended(@Param('id', ParseIntPipe) id: number, @Query({ transform: Paginable.transform }) params: ProjectUserListDto, @Req() request: IUserHolder): Promise<ProjectUserListDtoResponse> {
        let user = request.user;
        let project = await this.database.projectGet(id, user)

        if (user.type !== UserType.ADMINISTRATOR) {
            UserGuard.checkProject({
                isProjectRequired: true,
                projectRole: [LedgerProjectRole.PROJECT_MANAGER, LedgerProjectRole.USER_MANAGER]
            }, project);
        }
        else {
            UserGuard.checkProject({
                isProjectRequired: true
            }, project);
        }

        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        let query = this.database.user.createQueryBuilder('user')
            .innerJoinAndSelect('user.preferences', 'preferences')
            .innerJoinAndSelect("user.userRoles", 'role', `role.projectId = ${project.id}`)
        return TypeormUtil.toPagination(query, params as any, this.transform);
    }

    protected transform = async (item: UserEntity): Promise<ProjectUser> => item.toProjectObject();
}
