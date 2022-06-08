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
import { Company } from '@project/common/platform/company';
import { UserCompany, UserType } from '@project/common/platform/user';
import { CompanyEntity } from '@project/module/database/company';
import { COMPANY_URL } from '@project/common/platform/api';
import { IUserHolder, UserRoleEntity } from '@project/module/database/user';


// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class CompanyListDto implements Paginable<Company> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<Company>;

    @ApiPropertyOptional()
    sort?: FilterableSort<Company>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class CompanyListDtoResponse implements IPagination<UserCompany> {
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

@Controller(COMPANY_URL)
export class CompanyListController extends DefaultController<CompanyListDto, CompanyListDtoResponse> {
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

    @Swagger({ name: 'Get company list', response: CompanyListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.ADMINISTRATOR, UserType.EDITOR] })
    public async executeExtended(@Query({ transform: Paginable.transform }) params: CompanyListDto, @Req() request: IUserHolder): Promise<CompanyListDtoResponse> {
        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        let query = this.database.company.createQueryBuilder('company')
            .innerJoinAndSelect('company.preferences', 'preferences')
            .leftJoinAndMapMany("company.userRoles", UserRoleEntity, 'role', `role.userId = ${request.user.id} and role.companyId = company.id`)
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: CompanyEntity): Promise<UserCompany> => item.toUserObject();
}
