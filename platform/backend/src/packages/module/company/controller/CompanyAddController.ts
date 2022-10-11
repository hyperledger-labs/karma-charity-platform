import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { Type } from 'class-transformer';
import { IsDefined, Length, MaxLength, IsNotEmpty, IsBase64, IsNumber, IsDate, IsEmail, ValidateNested, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { IUserHolder, UserEntity, UserRoleEntity } from '@project/module/database/user';
import { DatabaseService } from '@project/module/database/service';
import { ObjectUtil, ValidateUtil } from '@ts-core/common';
import { UserType } from '@project/common/platform/user';
import { COMPANY_URL } from '@project/common/platform/api';
import { ICompanyAddDto, ICompanyAddDtoResponse } from '@project/common/platform/api/company';
import { Company, CompanyPreferences, CompanyStatus, CompanyType, COMPANY_ADD_TYPE } from '@project/common/platform/company';
import { CompanyEntity, CompanyPreferencesEntity } from '@project/module/database/company';
import { NalogService } from '@project/module/nalog/service';
import { LedgerCompanyRole } from '@project/common/ledger/role';
import { CompanyNotUndefinedError } from '@project/module/core/middleware';
import { PaymentAggregator } from '@project/common/platform/payment/aggregator';
import { CompanyPaymentAggregatorEntity } from '@project/module/database/company/CompanyPaymentAggregatorEntity';
import { Transport } from '@ts-core/common';
import { CryptoEncryptCommand } from '@project/module/crypto/transport';
import { CryptoKeyType } from '@project/common/platform/crypto';
import { TransformGroup } from '@project/module/database';
import { FileEntity } from '@project/module/database/file';
import { FileService } from '@project/module/file/service';
import { FileLinkType } from '@project/common/platform/file';
import { CompanyFileType } from '@project/common/platform/company';
import { TraceUtil } from '@ts-core/common';
import { Ed25519 } from '@ts-core/common';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

class CompanyAddPreferences extends CompanyPreferences {
    @IsBase64()
    declare public picture?: string;
}

export class CompanyAddDto implements ICompanyAddDto {
    @ApiProperty()
    @IsDefined()
    @ValidateNested()
    @Type(() => CompanyAddPreferences)
    preferences: CompanyAddPreferences;

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

    constructor(logger: Logger, private transport: Transport, private database: DatabaseService, private nalog: NalogService, private file: FileService) {
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
    @UserGuardOptions({ type: COMPANY_ADD_TYPE })
    public async executeExtended(@Body() params: CompanyAddDto, @Req() request: IUserHolder): Promise<ICompanyAddDtoResponse> {
        let user = request.user;
        /*
        TODO:
        if (!_.isNil(user.companyId)) {
            throw new CompanyNotUndefinedError();
        }
        */

        let [nalog] = await this.nalog.search(params.preferences.inn);
        ObjectUtil.copyProperties(nalog, params.preferences);

        let item = new CompanyEntity();
        item.type = CompanyType.NKO;
        item.status = CompanyStatus.DRAFT;
        item.preferences = new CompanyPreferencesEntity();
        ObjectUtil.copyPartial(params.preferences, item.preferences, null, ['picture']);
        item.preferences.picture = '';

        item.paymentAggregator = new CompanyPaymentAggregatorEntity(params.paymentAggregator);
        item.paymentAggregator.key = await this.transport.sendListen(new CryptoEncryptCommand({ type: CryptoKeyType.DATABASE, value: Ed25519.keys().privateKey }));

        await this.database.getConnection().transaction(async manager => {
            let fileRepository = manager.getRepository(FileEntity);
            let userRepository = manager.getRepository(UserEntity);
            let companyRepository = manager.getRepository(CompanyEntity);
            let roleRepository = manager.getRepository(UserRoleEntity);

            item = await companyRepository.save(item);
            await roleRepository.save(Object.values(LedgerCompanyRole).map(name => new UserRoleEntity(user.id, name, item.id)));

            user.companyId = item.id;
            await userRepository.save(user);

            let picture = await this.file.storage.upload(Buffer.from(params.preferences.picture, 'base64'), `${TraceUtil.generate()}.png`, '/company/');

            let file = new FileEntity();
            ObjectUtil.copyPartial(picture, file);
            file.type = CompanyFileType.PICTURE;
            file.linkId = item.id;
            file.linkType = FileLinkType.COMPANY;
            file.mime = 'image/png';
            file.extension = 'png';

            file = await fileRepository.save(file);

            item.preferences.picture = file.path;
            item = await companyRepository.save(item);
        });

        item = await this.database.companyGet(item.id, request.user);
        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
