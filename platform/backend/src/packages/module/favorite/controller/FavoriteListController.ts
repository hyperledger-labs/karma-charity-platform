import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common';
import { Logger } from '@ts-core/common';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { UserGuard } from '@project/module/guard';
import { Favorite, FavoriteStatus } from '@project/common/platform/favorite';
import { FavoriteEntity } from '@project/module/database/favorite';
import { FAVORITE_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';
import { ProjectEntity } from '@project/module/database/project';
import { CompanyEntity } from '@project/module/database/company';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class FavoriteListDto implements Paginable<Favorite> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Favorite>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Favorite>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class FavoriteListDtoResponse implements IPagination<Favorite> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: Favorite })
    items: Array<Favorite>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(FAVORITE_URL)
export class FavoriteListController extends DefaultController<FavoriteListDto, FavoriteListDtoResponse> {
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

    @Swagger({ name: 'Get favorite list', response: FavoriteListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    public async executeExtended(@Query({ transform: Paginable.transform }) params: FavoriteListDto, @Req() request: IUserHolder): Promise<FavoriteListDtoResponse> {
        let user = request.user;

        let query = this.database.favorite.createQueryBuilder('favorite');
        query.where('favorite.userId = :userId', { userId: user.id });
        query.andWhere('favorite.status = :status', { status: FavoriteStatus.ACTIVE });
        query.leftJoinAndMapOne('favorite.project', ProjectEntity, 'project', `favorite.projectId = project.id`);
        this.database.addProjectRelations(query, user);
        query.leftJoinAndMapOne('favorite.company', CompanyEntity, 'company', `favorite.companyId = company.id`);
        this.database.addCompanyRelations(query, user);

        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: FavoriteEntity): Promise<Favorite> => item.toObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
