import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { ObjectUtil, ValidateUtil } from '@ts-core/common/util';
import { UserType } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { ICompanyAddDto, ICompanyAddDtoResponse } from '@project/common/platform/api/company';
import { Company, CompanyPreferences, CompanyStatus } from '@project/common/platform/company';
import { CompanyEntity, CompanyPreferencesEntity } from '@project/module/database/company';
import { NalogService } from '@project/module/nalog/service';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { CompanyNotUndefinedError } from '@project/module/core/middleware';
import { PaymentAggregator } from '@project/common/platform/payment/aggregator';
import { CompanyPaymentAggregatorEntity } from '@project/module/database/company/CompanyPaymentAggregatorEntity';
import { Transport } from '@ts-core/common/transport';
import { CryptoEncryptCommand } from '@project/module/crypto/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class CompanyAddDto implements ICompanyAddDto {
    @ApiProperty()
    @IsDefined()
    preferences: Partial<CompanyPreferences>;

    @ApiProperty()
    @IsDefined()
    paymentAggregator: Partial<PaymentAggregator>;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

@Controller(COMPANY_URL)
export class CompanyAddController extends DefaultController<ICompanyAddDto, ICompanyAddDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService, private nalog: NalogService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Company add', response: Company })
    @Post()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        type: UserType.COMPANY_MANAGER,
        company: {
            required: false
        }
    })
    public async executeExtended(@Body() params: CompanyAddDto, @Req() request: IUserHolder): Promise<ICompanyAddDtoResponse> {
        let user = request.user;
        let company = request.company;
        if (!_.isNil(company)) {
            throw new CompanyNotUndefinedError();
        }

        let [nalog] = await this.nalog.search(params.preferences.inn);
        ObjectUtil.copyProperties(nalog, params.preferences);

        company = new CompanyEntity();
        company.status = CompanyStatus.DRAFT;
        company.preferences = new CompanyPreferencesEntity(params.preferences);
        company.paymentAggregator = new CompanyPaymentAggregatorEntity(params.paymentAggregator);

        company.paymentAggregator.key = await this.transport.sendListen(new CryptoEncryptCommand({ type: CryptoKeyType.DATABASE, value: company.paymentAggregator.key }));

        await this.database.getConnection().transaction(async manager => {
            let userRepository = manager.getRepository(UserEntity);
            let companyRepository = manager.getRepository(CompanyEntity);
            let userRoleRepository = manager.getRepository(UserRoleEntity);

            ValidateUtil.validate(company);
            company = user.company = await companyRepository.save(company);

            ValidateUtil.validate(user);
            await userRepository.save(user);

            company.userRoles = [];
            for (let role of Object.values(LedgerCompanyRole)) {
                let item = new UserRoleEntity(user.id, role, company.id);

                ValidateUtil.validate(item);
                await userRoleRepository.save(item);
                company.userRoles.push(item);
            }
        });
        return company.toUserObject();
    }
}
