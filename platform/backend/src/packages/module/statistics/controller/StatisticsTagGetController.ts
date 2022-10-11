import { Controller, Get, Query } from '@nestjs/common';
import { DefaultController, Cache } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { Logger, DateUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { Paginable, FilterableConditionType, FilterableDataType } from '@ts-core/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DatabaseService } from '@project/module/database/service';
import { Swagger } from '@project/module/swagger';
import { SelectQueryBuilder } from 'typeorm';
import { STATISTICS_TAG_URL, STATISTICS_URL } from '@project/common/platform/api';
import { IStatisticsDtoResponse, IStatisticsTagDtoResponse } from '@project/common/platform/api/statistics';
import { ProjectStatus, ProjectTag } from '@project/common/platform/project';
import { PaymentAccountId, PaymentStatus } from '@project/common/platform/payment';
import { Account, Accounts } from '@project/common/platform/account';
import { IStatisticsTagDto } from '@project/common/platform/api/statistics';
import { ProjectEntity } from '@project/module/database/project';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class StatisticsTagDto implements IStatisticsTagDto {
    @ApiProperty()
    @IsEnum(ProjectTag)
    tag: ProjectTag;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${STATISTICS_TAG_URL}`)
export class StatisticsGetController extends DefaultController<IStatisticsTagDto, IStatisticsTagDtoResponse> {
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

    private async getItem(params: IStatisticsTagDto): Promise<IStatisticsTagDtoResponse> {
        let item = {} as IStatisticsTagDtoResponse;
        let date = DateUtil.getDate(new Date().getTime() - 7 * DateUtil.MILLISECONDS_DAY);

        item.newWeekly = await this.database.project.createQueryBuilder('project')
            .leftJoinAndSelect('project.preferences', 'projectPreferences')
            .where('projectPreferences.tag = :tag', { tag: params.tag })
            .andWhere('project.status = :status', { status: ProjectStatus.ACTIVE })
            .andWhere('project.updatedDate > :date', { date })
            .getCount();

        /*
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
            .andWhere(`transaction.debet = :debet`, { debet: PaymentAccountId.AC00 })
            .groupBy('transaction.coinId')
            .getRawMany()

        item.paymentsTodayAmount = {} as Accounts;
        if (!_.isEmpty(payments)) {
            payments.forEach(coin => item.paymentsTodayAmount[coin.coinId] = coin.amount);
        }
        */

        return item;
    }

    private setTag(query: SelectQueryBuilder<ProjectEntity>, tag: ProjectTag): void {
        TypeormUtil.applyConditions(query, {
            tags: {
                condition: FilterableConditionType.INCLUDES_ONE_OF,
                value: [tag],
                type: FilterableDataType.ARRAY,
            }
        })
    }

    private getCacheKey(): string {
        return `statisticsTag`;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: `Get statistics by tag`, response: null })
    @Get()
    public async execute(@Query({ transform: Paginable.transform }) params: StatisticsTagDto): Promise<IStatisticsTagDtoResponse> {
        return this.getItem(params);
    }
}