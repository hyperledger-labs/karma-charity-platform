import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserStatus } from '@project/common/platform/user';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { Swagger } from '@project/module/swagger';
import { IUserHolder } from '@project/module/database/user';
import { UserGuard } from '@project/module/guard';
import { DatabaseService } from '@project/module/database/service';
import * as _ from 'lodash';
import { DEACTIVATE_URL } from '@project/common/platform/api';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(DEACTIVATE_URL)
export class DeactivateController extends DefaultController<void, void> {
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

    @Swagger({ name: 'Deactivate user', response: null })
    @Post()
    @UseGuards(UserGuard)
    public async executeExtended(@Req() request: IUserHolder): Promise<void> {
        let item = request.user;
        item.status = UserStatus.NON_ACTIVE;
        await this.database.user.save(item);
    }
}
