import { Controller, Param, Get } from '@nestjs/common';
import { DefaultController } from '@ts-core/backend-nestjs';
import { TypeormUtil } from '@ts-core/backend';
import { Logger, FilterableConditionType, ParseFilterableCondition, FilterableConditions, FilterableDataType } from '@ts-core/common';
import * as _ from 'lodash';
import { Swagger } from '@project/module/swagger';
import { AUTOCOMPLETE_CITY_URL } from '@project/common/platform/api';
import { DatabaseService } from '@project/module/database/service';
import { CityEntity } from '@project/module/database/city';

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(`${AUTOCOMPLETE_CITY_URL}/:value`)
export class AutocompleteCityController extends DefaultController<string, Array<string>> {
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

    @Swagger({ name: 'Autocomplete city', response: Array })
    @Get()
    public async execute(@Param('value') value: string): Promise<Array<string>> {
        if (_.isEmpty(value) || value.length < 2) {
            return [];
        }
        let query = this.database.city.createQueryBuilder('city')
        let conditions: FilterableConditions<CityEntity> = { name: value };
        ParseFilterableCondition(conditions, 'name', FilterableDataType.STRING, FilterableConditionType.CONTAINS);
        TypeormUtil.applyConditions(query, conditions);

        let items = await query.getMany();
        return items.map(item => item.name);
    }
}
