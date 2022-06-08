import { TransportHttp, ITransportHttpSettings } from '@ts-core/common/transport/http';
import { ILogger } from '@ts-core/common/logger';
import * as _ from 'lodash';
import { TransformUtil } from '@ts-core/common/util';
import { INalogObject } from '@project/common/platform/api/nalog';

export class NalogClient extends TransportHttp<ITransportHttpSettings> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: ILogger) {
        super(logger, { method: 'get', baseURL: 'https://egrul.nalog.ru', isHandleError: true, isHandleLoading: true, headers: {} });
    }

    // --------------------------------------------------------------------------
    //
    //  Auth Methods
    //
    // --------------------------------------------------------------------------

    public async search(value: string): Promise<Array<INalogObject>> {
        let data = `query=${value}`;
        let { t } = await this.call('/',
            {
                data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Content-Length": data.length,
                    "Host": ""
                },
                method: 'post'
            });
        let item = await this.call(`search-result/${t}`);
        if (_.isEmpty(item.rows)) {
            return [];
        }
        return item.rows.map(item => {
            let array = !_.isNil(item.r) ? item.r.split('.') : [];
            return TransformUtil.toClass(INalogObject, {
                name: item.n,
                nameShort: item.c,
                ceo: item.g,
                inn: item.i,
                kpp: item.p,
                ogrn: item.o,
                founded: new Date(Number(array[2]), Number(array[1]) - 1, Number(array[0])),
                address: item.a
            });
        });
    }
}
