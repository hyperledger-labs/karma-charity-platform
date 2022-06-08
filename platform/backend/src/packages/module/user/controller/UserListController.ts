import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend-nestjs/controller';
import { TypeormUtil } from '@ts-core/backend/database/typeorm';
import { FilterableConditions, FilterableSort, IPagination, Paginable } from '@ts-core/common/dto';
import { Logger } from '@ts-core/common/logger';
import { IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { DatabaseService } from '@project/module/database/service';
import { IUserHolder, UserEntity } from '@project/module/database/user';
import { User, UserType } from '@project/common/platform/user';
import { USER_URL } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { CompanyUndefinedError } from '@project/module/core/middleware';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

export class UserListDto implements Paginable<User> {
    @ApiPropertyOptional()
    conditions?: FilterableConditions<User>;

    @ApiPropertyOptional()
    sort?: FilterableSort<User>;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_SIZE })
    pageSize: number;

    @ApiPropertyOptional({ default: Paginable.DEFAULT_PAGE_INDEX })
    pageIndex: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class UserListDtoResponse implements IPagination<User> {
    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    pageIndex: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    total: number;

    @ApiProperty({ isArray: true, type: User })
    items: Array<User>;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(USER_URL)
export class UserListController extends DefaultController<UserListDto, UserListDtoResponse> {
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

    @Swagger({ name: 'Get user list', response: UserListDtoResponse })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({ type: [UserType.ADMINISTRATOR, UserType.COMPANY_MANAGER, UserType.COMPANY_WORKER] })
    public async executeExtended(@Query({ transform: Paginable.transform }) params: UserListDto, @Req() request: IUserHolder): Promise<UserListDtoResponse> {
        let user = request.user;
        let company = request.company;
        let isCompanyUser = (user.type === UserType.COMPANY_MANAGER || user.type === UserType.COMPANY_WORKER);
        if (isCompanyUser && _.isNil(company)) {
            throw new CompanyUndefinedError();
        }

        let query = this.database.user.createQueryBuilder('user')
            .innerJoinAndSelect('user.preferences', 'preferences');

        if (isCompanyUser) {
            query.innerJoinAndSelect('user.company', 'company');
            query.where(`company.id  = :id`, { id: company.id });
            query.leftJoinAndSelect("company.userRoles", 'role', `role.userId = user.id and role.companyId = company.id`)
        }

        if (_.isNil(params.conditions)) {
            params.conditions = {};
        }
        return TypeormUtil.toPagination(query, params, this.transform);
    }

    protected transform = async (item: UserEntity): Promise<User> => item.toObject();
}
