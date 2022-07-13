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
import { UserCompany } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { CompanyUser, COMPANY_USER_LIST_ROLE } from '@project/common/platform/company';
import { TransformGroup } from '@project/module/database';

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
    public async executeExtended(@Param('id', ParseIntPipe) id: number, @Query({ transform: Paginable.transform }) params: CompanyUserListDto, @Req() request: IUserHolder): Promise<CompanyUserListDtoResponse> {
        let user = request.user;
        let item = await this.database.companyGet(id, user)

        let companyRole = !user.isAdministrator ? COMPANY_USER_LIST_ROLE : null;
        UserGuard.checkCompany({ isCompanyRequired: true, companyRole }, item);

        let query = this.database.user.createQueryBuilder('user')
            .innerJoinAndSelect('user.preferences', 'preferences')
            .innerJoinAndMapMany("user.userRoles", UserRoleEntity, 'userRole', `userRole.companyId = ${id} AND userRole.userId = user.id`)
        return TypeormUtil.toPagination(query, params as any, this.transform);
    }

    protected transform = async (item: UserEntity): Promise<CompanyUser> => item.toCompanyObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
}
