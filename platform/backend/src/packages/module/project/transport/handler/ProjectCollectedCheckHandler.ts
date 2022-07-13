import { Logger } from '@ts-core/common/logger';
import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { Transport, TransportCommandHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { IProjectCollectedCheckDto, ProjectCollectedCheckCommand } from '../ProjectCollectedCheckCommand';
import { DatabaseService } from '@project/module/database/service';
import { UserGuard } from '@project/module/guard';
import { ProjectStatus } from '@project/common/platform/project';
import { MathUtil } from '@ts-core/common/util';
import { ProjectEntity } from '@project/module/database/project';

@Injectable()
export class ProjectCollectedCheckHandler extends TransportCommandHandler<IProjectCollectedCheckDto, ProjectCollectedCheckCommand> {

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, transport: Transport, private database: DatabaseService) {
        super(logger, transport, ProjectCollectedCheckCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private async setProjectCollected(project: ProjectEntity, paymentId: number, delta: string): Promise<void> {
        
    }

    protected async execute(params: IProjectCollectedCheckDto): Promise<void> {
        let item = await this.database.projectGet(params.projectId);
        UserGuard.checkProject({ isProjectRequired: true, projectStatus: [ProjectStatus.ACTIVE] }, item);

        let balance = item.toUserObject().balance;
        if (_.isNil(balance.required) || _.isNil(balance.collected)) {
            return;
        }
        let delta = '0';
        let coinId = null;
        for (coinId in balance.required) {
            if (_.isNil(balance.collected[coinId])) {
                continue;
            }
            let required = balance.required[coinId];
            let collected = balance.collected[coinId];
            delta = MathUtil.subtract(collected, required);
            if (MathUtil.greaterThan(delta, '0')) {
                await this.setProjectCollected(item, params.paymentId, delta);
                return;
            }
        }
    }
}
