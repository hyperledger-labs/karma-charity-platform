import { Controller, Query, Get, Header } from '@nestjs/common';
import { DefaultController, Cache } from '@ts-core/backend-nestjs';
import { Logger, ExtendedError, DateUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { IUIDable } from '@ts-core/common';
import { IsCompany, IsProject, IsUser, LedgerObjectType } from '@project/common/ledger';
import { ILedgerObjectDetails, LEDGER_OBJECT_DETAILS_URL } from '@project/common/platform/api';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class LedgerObjectDetailsRequest implements IUIDable {
    @ApiProperty()
    @IsString()
    uid: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${LEDGER_OBJECT_DETAILS_URL}`)
export class LedgerObjectDetailsGetController extends DefaultController<LedgerObjectDetailsRequest, any> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private database: DatabaseService, private cache: Cache) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async getItem(params: LedgerObjectDetailsRequest): Promise<ILedgerObjectDetails> {
        if (IsUser(params.uid)) {
            let item = await this.database.user.findOneByOrFail({ ledgerUid: params.uid } as any);
            return {
                name: item.preferences.name,
                type: LedgerObjectType.USER,
                picture: item.preferences.picture,
                description: item.preferences.description
            }
        }
        if (IsCompany(params.uid)) {
            let item = await this.database.company.findOneByOrFail({ ledgerUid: params.uid } as any);
            return {
                name: item.preferences.title,
                type: LedgerObjectType.COMPANY,
                picture: item.preferences.picture,
                description: item.preferences.description
            }
        }
        if (IsProject(params.uid)) {
            let item = await this.database.project.findOneByOrFail({ ledgerUid: params.uid } as any);
            return {
                name: item.preferences.title,
                type: LedgerObjectType.PROJECT,
                picture: item.preferences.picture,
                description: item.preferences.descriptionShort
            }
        }
        throw new ExtendedError(`Unknown type of uid`);
    }

    private getCacheKey(params: LedgerObjectDetailsRequest): string {
        return `ledgerObject_${params.uid}`;
    }
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: `Get ledger object details by uid`, response: null })
    @Get()
    public async execute(@Query() params: LedgerObjectDetailsRequest): Promise<ILedgerObjectDetails> {
        let item = await this.cache.wrap<ILedgerObjectDetails>(this.getCacheKey(params), () => this.getItem(params), {
            ttl: DateUtil.MILLISECONDS_DAY / DateUtil.MILLISECONDS_SECOND
        });
        return item;
    }
}
