import * as _ from 'lodash';
import { ITransportFabricConnectionSettings } from '@hlf-core/transport/client';
import { FileUtil } from '@ts-core/backend/file';
import { FabricConnectionSettingsFactory } from '@hlf-core/api/factory';
import { IKeyAsymmetric } from '@ts-core/common/crypto';

export class LedgerSettingsFactory extends FabricConnectionSettingsFactory<ILedgerConnectionSettings> {
    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public async load(path: string): Promise<void> {
        this.logger.log(`Loading ledgers settings ${path}...`);
        let items = await FileUtil.jsonRead<{ ledgers: Array<ILedgerConnectionSettings> }>(path);
        if (!_.isEmpty(items)) {
            await this.parse(items.ledgers);
        }
    }

    public getById(id: number): ILedgerConnectionSettings {
        return _.find(this.items.collection, { id });
    }
}

export interface ILedgerConnectionSettings extends ITransportFabricConnectionSettings {
    id: number;
    batch?: ILedgerBatchSettings;
    passwordToReset?: string;
}

export interface ILedgerBatchSettings {
    key: IKeyAsymmetric;
    timeout: number;
}
