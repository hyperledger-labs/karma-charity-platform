import { Controller, Post, UseGuards } from '@nestjs/common';
import { LOGOUT_URL } from '@project/common/platform/api';
import { Swagger } from '@project/module/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { UserGuard } from '@project/module/guard';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(LOGOUT_URL)
export class LogoutController extends DefaultController<void, void> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Logout user', response: null })
    @Post()
    @UseGuards(UserGuard)
    public async executeExtended(): Promise<void> {}
}
