import { Controller, Param, Req, Get, UseGuards } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { Logger } from '@ts-core/common';
import { ParseIntPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { PaymentAccountId, PaymentTransactionType } from '@project/common/platform/payment';
import { DatabaseService } from '@project/module/database/service';
import { CompanyNotFoundError } from '@project/module/core/middleware';;
import { Swagger } from '@project/module/swagger';
import { UserGuard, UserGuardOptions } from '@project/module/guard';
import { PROJECT_URL } from '@project/common/platform/api';
import { UserCompany, UserProject } from '@project/common/platform/user';
import { IUserHolder } from '@project/module/database/user';
import { IProjectGetDtoResponse } from '@project/common/platform/api/project';
import { TransformGroup } from '@project/module/database';
import { CoinEmitType } from '@project/common/transport/command/coin';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${PROJECT_URL}/:id`)
export class ProjectGetController extends DefaultController<number, IProjectGetDtoResponse> {
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

    @Swagger({ name: `Get user project id`, response: UserCompany })
    @Get()
    @UseGuards(UserGuard)
    @UserGuardOptions({
        required: false
    })
    public async executeExtends(@Param('id', ParseIntPipe) id: number, @Req() request: IUserHolder): Promise<IProjectGetDtoResponse> {
        let item = await this.database.projectGet(id, request.user, true);
        UserGuard.checkProject({ isProjectRequired: true }, item);

        item.paymentsAmount = await this.database.paymentTransaction.createQueryBuilder('paymentTransaction')
            .where('paymentTransaction.projectId = :projectId', { projectId: id })
            .andWhere('paymentTransaction.type = :type', { type: CoinEmitType.DONATED })
            .andWhere('paymentTransaction.activatedDate IS NOT NULL')
            .getCount();

        return item.toUserObject({ groups: [TransformGroup.PUBLIC_DETAILS] });
    }
}
