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
import { UserCompany, UserType } from '@project/common/platform/user';
import { CompanyEntity } from '@project/module/database/company';
import { COMPANY_URL } from '@project/common/platform/api';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { CompanyUser } from '@project/common/platform/company';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { CompanyNotFoundError, RequestInvalidError } from '@project/module/core/middleware';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class CompanyUserListDto implements Paginable<CompanyUser> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<CompanyUser>;

    @ApiPropertyOptional()
    sort?: FilterableSort<UserCompany>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class CompanyUserListDtoResponse implements IPagination<CompanyUser> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: CompanyUser })
    items: Array<CompanyUser>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${COMPANY_URL}/:id/user`)
export class CompanyUserListController extends DefaultController<CompanyUserListDto, CompanyUserListDtoResponse> {
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

    @Swagger({ name: 'Get company users list', response: CompanyUserListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER]
    })
    public async executeExtended(@Param('id', ParseIntPipe) id: number, @Query({ transform: Paginable.transform }) params: CompanyUserListDto, @Req() request: IUserHolder): Promise<CompanyUserListDtoResponse> {
        let user = request.user;
        let company = request.company;

        if (user.type !== UserType.ADMINISTRATOR) {
            UserGuard.checkCompany({ isCompanyRequired: true, companyRole: [LedgerCompanyRole.COMPANY_MANAGER, LedgerCompanyRole.USER_MANAGER] }, company);
        }
        else {
            if (_.isNil(id)) {
                throw new RequestInvalidError({ name: 'id', value: id })
            }
            company = await this.database.companyGet(id);
            UserGuard.checkCompany({ isCompanyRequired: true }, company);
        }

        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        let query = this.database.user.createQueryBuilder('user')
            .innerJoinAndSelect('user.preferences', 'preferences')
            .innerJoinAndSelect("user.userRoles", 'role', `role.companyId = ${company.id}`)
        return TypeormUtil.toPagination(query, params as any, this.transform);
    }

    protected transform = async (item: UserEntity): Promise<CompanyUser> => item.toCompanyObject();
}
