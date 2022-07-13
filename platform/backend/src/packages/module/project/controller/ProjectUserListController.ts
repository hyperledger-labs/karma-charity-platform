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
import { UserGuard } from '@project/module/guard';
import { UserProject } from '@project/common/platform/user';
import { PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { ProjectUser } from '@project/common/platform/project';
import { TransformGroup } from '@project/module/database';
import { PROJECT_USER_LIST_ROLE } from '@project/common/platform/project';

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
    public async executeExtended(@Param('id', ParseIntPipe) id: number, @Query({ transform: Paginable.transform }) params: ProjectUserListDto, @Req() request: IUserHolder): Promise<ProjectUserListDtoResponse> {
        let user = request.user;
        let item = await this.database.projectGet(id, user)

        let projectRole = !user.isAdministrator ? PROJECT_USER_LIST_ROLE : null;
        UserGuard.checkProject({ isProjectRequired: true, projectRole }, item);

        let query = this.database.user.createQueryBuilder('user')
            .innerJoinAndSelect('user.preferences', 'preferences')
            .innerJoinAndMapMany("user.userRoles", UserRoleEntity, 'userRole', `userRole.projectId = ${id} AND userRole.userId = user.id`)
        return TypeormUtil.toPagination(query, params as any, this.transform);
    }

    protected transform = async (item: UserEntity): Promise<ProjectUser> => item.toProjectObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
