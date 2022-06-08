import { Injectable } from '@angular/core';
import { DestroyableContainer, LoadableEvent } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend/language';
import { LedgerBlockMapCollection, LedgerBlockTransactionMapCollection, LedgerBlockEventMapCollection } from '../lib';
import { LedgerApiClient } from '@hlf-explorer/common/api';

@Injectable()
export class LedgerService extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    private _blocks: LedgerBlockMapCollection;
    private _events: LedgerBlockEventMapCollection;
    private _transactions: LedgerBlockTransactionMapCollection;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(language: LanguageService, api: LedgerApiClient) {
        super();

        this._blocks = new LedgerBlockMapCollection(api);
        this._events = new LedgerBlockEventMapCollection(api);
        this._transactions = new LedgerBlockTransactionMapCollection(api);

        // Language
        if (language.isLoaded) {
            this.commitLanguageProperties();
        }
        language.events.subscribe(data => {
            if (data.type === LoadableEvent.COMPLETE) {
                this.commitLanguageProperties();
            }
        });
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitLanguageProperties(): void { }

    public get blocks(): LedgerBlockMapCollection {
        return this._blocks;
    }

    public get events(): LedgerBlockEventMapCollection {
        return this._events;
    }

    public get transactions(): LedgerBlockTransactionMapCollection {
        return this._transactions;
    }
}
