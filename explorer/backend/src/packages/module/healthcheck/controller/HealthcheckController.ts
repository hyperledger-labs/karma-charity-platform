import { Controller, Get } from '@nestjs/common';
import { Logger, LoggerWrapper } from '@ts-core/common/logger';
import { DatabaseService } from '@project/module/database/service';

@Controller('health')
export class HealthcheckController extends LoggerWrapper {

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

    @Get('live')
    public async live(): Promise<any> {
        return this.database.ledger.find();
    }

    @Get('ready')
    public async ready(): Promise<any> {
        return this.database.ledger.find();
    }
}
