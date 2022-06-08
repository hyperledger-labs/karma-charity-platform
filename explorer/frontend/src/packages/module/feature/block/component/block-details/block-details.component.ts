import { Component, ViewContainerRef, Input } from '@angular/core';
import { ViewUtil, IWindowContent, ISelectListItem, SelectListItems, SelectListItem } from '@ts-core/angular';
import { LedgerBlock, LedgerBlockEvent, LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import { TextHighlightUtil } from '@core/util';
import * as _ from 'lodash';
import { MapCollection } from '@ts-core/common/map';
import { RouterService } from '@core/service';
import { LanguageService } from '@ts-core/frontend/language';
import { ObjectUtil } from '@ts-core/common/util';
import { Transport } from '@ts-core/common/transport';
import { TransactionOpenCommand } from '@feature/transaction/transport';
import { EventOpenCommand } from '@feature/event/transport';

@Component({
    selector: 'block-details',
    templateUrl: 'block-details.component.html'
})
export class BlockDetailsComponent extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public tabs: SelectListItems<ISelectListItem<string>>;
    public rawText: string;

    public blockEvents: MapCollection<LedgerBlockEvent>;
    public blockTransactions: MapCollection<LedgerBlockTransaction>;

    private _block: LedgerBlock;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef, language: LanguageService, private transport: Transport) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');

        this.blockEvents = new MapCollection('uid');
        this.blockTransactions = new MapCollection('uid');

        this.tabs = this.addDestroyable(new SelectListItems(language));
        this.tabs.add(new SelectListItem('block.details', 0, 'details'));
        this.tabs.add(new SelectListItem('block.transaction.transactions', 1, 'transactions'));
        this.tabs.add(new SelectListItem('block.event.events', 2, 'events'));
        this.tabs.add(new SelectListItem('block.rawData', 3, 'rawData'));
        this.tabs.complete(0);
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitBlockProperties(): void {

        this.blockEvents.clear();
        this.blockEvents.addItems(this.block.events);

        this.blockTransactions.clear();
        this.blockTransactions.addItems(this.block.transactions);

        this.parseObject(this.block);

        let value = null;

        value = TextHighlightUtil.text(JSON.stringify(this.block.rawData, null, 2));
        if (value !== this.rawText) {
            this.rawText = value;
        }
    }

    private parseObject(item: any): void {
        if (_.isNil(item) || !_.isObject(item)) {
            return;
        }
        item = item as any;
        if (!ObjectUtil.hasOwnProperties(item, ['type', 'data']) || item.type !== 'Buffer') {
            for (let value of Object.values(item)) {
                if (_.isObject(value)) {
                    this.parseObject(value);
                }
            }
            return;
        }
        item.data = `Utf8Array(${item.data.length})`;
        // let data = Buffer.from(item.data).toString('hex');
        // item.data = ObjectUtil.isJSON(data) ? JSON.parse(data) : data;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public eventOpen(item: LedgerBlockEvent): void {
        this.transport.send(new EventOpenCommand(item));
    }
    public transactionOpen(item: LedgerBlockTransaction): void {
        this.transport.send(new TransactionOpenCommand(item));
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get block(): LedgerBlock {
        return this._block;
    }
    @Input()
    public set block(value: LedgerBlock) {
        if (value === this._block) {
            return;
        }
        this._block = value;
        if (!_.isNil(value)) {
            this.commitBlockProperties();
        }
    }
}
