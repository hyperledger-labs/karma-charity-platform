import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
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
import { Project } from '@project/common/platform/project';
import { UserProject, UserType } from '@project/common/platform/user';
import { ProjectEntity } from '@project/module/database/project';
import { COMPANY_URL, PROJECT_URL } from '@project/common/platform/api';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class ProjectListDto implements Paginable<Project> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Project>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Project>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class ProjectListDtoResponse implements IPagination<UserProject> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: UserProject })
    items: Array<UserProject>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(PROJECT_URL)
export class ProjectListController extends DefaultController<ProjectListDto, ProjectListDtoResponse> {
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

    @Swagger({ name: 'Get project list', response: ProjectListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtended(@Query({ transform: Paginable.transform }) params: ProjectListDto, @Req() request: IUserHolder): Promise<ProjectListDtoResponse> {
        let user = request.user;
        let company = request.company;

        let query = this.database.project.createQueryBuilder('project');
        this.database.addProjectRelations(query, user);

        if (user.isCompanyManager || user.isCompanyWorker) {
            UserGuard.checkCompany({ isCompanyRequired: true }, company);
            query.where('project.companyId = :companyId', { companyId: company.id });
        }

        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: ProjectEntity): Promise<UserProject> => item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
