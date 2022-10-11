import { Controller, Get } from '@nestjs/common';
import { DefaultController, Cache } from '@ts-core/backend-nestjs';
import { Logger, DateUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { IUIDable } from '@ts-core/common';
import { STATISTICS_URL } from '@project/common/platform/api';
import { IStatisticsDtoResponse } from '@project/common/platform/api/statistics';
import { ProjectStatus } from '@project/common/platform/project';
import { PaymentAccountId, PaymentStatus } from '@project/common/platform/payment';
import { Account, Accounts } from '@project/common/platform/account';

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

@Controller(`${STATISTICS_URL}`)
export class StatisticsGetController extends DefaultController<void, IStatisticsDtoResponse> {
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

    private async getItem(): Promise<IStatisticsDtoResponse> {
        let item = {} as IStatisticsDtoResponse;
        let date = DateUtil.getDate(new Date().getTime() - 1 * DateUtil.MILLISECONDS_DAY);

        item.projectsNew = await this.database.project.createQueryBuilder('project')
            .where('project.status = :status', { status: ProjectStatus.ACTIVE })
            .andWhere('project.updatedDate > :date', { date })
            .getCount();

        item.projectsClosed = await this.database.project.createQueryBuilder('project')
            .where('project.status = :status', { status: ProjectStatus.REPORT_SUBMITTED })
            .getCount();

        item.paymentsTotal = await this.database.payment.createQueryBuilder('payment')
            .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
            .getCount();

        item.paymentsToday = await this.database.payment.createQueryBuilder('payment')
            .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
            .andWhere('payment.createdDate > :date', { date })
            .getCount();

        let payments = null;
        payments = await this.database.paymentTransaction.createQueryBuilder('transaction')
            .select('transaction.coinId', 'coinId')
            .addSelect('SUM(transaction.amount)', 'amount')
            .where(`transaction.debet = :debet`, { debet: PaymentAccountId.AC00 })
            .andWhere('transaction.activatedDate > :date', { date })
            .groupBy('transaction.coinId')
            .getRawMany()

        item.paymentsTodayAmount = {} as Accounts;
        if (!_.isEmpty(payments)) {
            payments.forEach(coin => item.paymentsTodayAmount[coin.coinId] = coin.amount);
        }

        payments = await this.database.paymentTransaction.createQueryBuilder('transaction')
            .select('transaction.coinId', 'coinId')
            .addSelect('SUM(transaction.amount)', 'amount')
            .where(`transaction.debet = :debet`, { debet: PaymentAccountId.AC00 })
            .andWhere('transaction.activatedDate IS NOT NULL')
            .groupBy('transaction.coinId')
            .getRawMany();

        item.paymentsTotalAmount = {} as Accounts;
        if (!_.isEmpty(payments)) {
            payments.forEach(coin => item.paymentsTotalAmount[coin.coinId] = coin.amount);
        }
        
        return item;
    }

    private getCacheKey(): string {
        return `statistics`;
    }
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: `Get ledger object details by uid`, response: null })
    @Get()
    public async execute(): Promise<IStatisticsDtoResponse> {
        return this.getItem();
        /*
        let item = await this.cache.wrap<ILedgerObjectDetails>(this.getCacheKey(), () => this.getItem(), {
            ttl: DateUtil.MILLISECONDS_DAY / DateUtil.MILLISECONDS_SECOND
        });
        return item;
        */
    }
}