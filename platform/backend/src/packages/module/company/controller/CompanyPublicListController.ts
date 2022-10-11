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
import { CompanyEntity } from '@project/module/database/company';
import { COMPANY_PUBLIC_URL } from '@project/common/platform/api';
import { IUserHolder } from '@project/module/database/user';
import { TransformGroup } from '@project/module/database';
import { ICompanyPublicListDto, ICompanyPublicListDtoResponse } from '@project/common/platform/api/company';
import { Company, CompanyPreferences } from '@project/common/platform/company';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { FavoriteStatus } from '@project/common/platform/favorite';
import { UserCompany } from '@project/common/platform/user';
import { FavoriteEntity } from '@project/module/database/favorite';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class CompanyPublicListDto implements ICompanyPublicListDto {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Company>;

    @ApiPropertyOptional()
    conditionsExtras?: FilterableConditions<CompanyPreferences>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Company>;

    @ApiPropertyOptional()
    sortExtras?: FilterableSort<CompanyPreferences>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class CompanyPublicListDtoResponse implements ICompanyPublicListDtoResponse {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: UserCompany })
    items: Array<UserCompany>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(COMPANY_PUBLIC_URL)
export class CompanyPublicListController extends DefaultController<CompanyPublicListDto, CompanyPublicListDtoResponse> {
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

    @Swagger({ name: 'Get company public list', response: CompanyPublicListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({ required: false })
    public async executeExtended(@Query({ transform: Paginable.transform }) params: CompanyPublicListDto, @Req() request: IUserHolder): Promise<CompanyPublicListDtoResponse> {
        let query = this.database.company.createQueryBuilder('company');
        this.database.addCompanyRelations(query, request.user);

        if (!_.isEmpty(params.conditionsExtras)) {
            TypeormUtil.applyConditions(query, params.conditionsExtras, 'companyPreferences');
        }
        if (!_.isEmpty(params.sortExtras)) {
            TypeormUtil.applySort(query, params.sortExtras, 'companyPreferences');
        }
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: CompanyEntity): Promise<UserCompany> => item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
