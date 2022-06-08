import { Component, ViewContainerRef, Input } from '@angular/core';
import { ViewUtil, IWindowContent, SelectListItems, ISelectListItem, SelectListItem } from '@ts-core/angular';
import { LedgerBlockTransaction } from '@hlf-explorer/common/ledger';
import * as _ from 'lodash';
import { PipeService } from '@core/service';
import { LedgerBlockTransactionWrapper } from '@core/lib';
import { LanguageService } from '@ts-core/frontend/language';
import { Transport } from '@ts-core/common/transport';
import { BlockOpenCommand } from '@feature/block/transport';

@Component({
    selector: 'transaction-details',
    templateUrl: 'transaction-details.component.html'
})
export class TransactionDetailsComponent extends IWindowContent {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public tabs: SelectListItems<ISelectListItem<string>>;
    public wrapper: LedgerBlockTransactionWrapper;

    public isValid: boolean;
    public validationCode: string;

    public response: string;
    public responseErrorMessage: string;

    public request: string;
    public requestRaw: string;
    public requestUserId: string;
    public requestAlgorithm: string;

    private _transaction: LedgerBlockTransaction;
    private requestTab: ISelectListItem<string>;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(container: ViewContainerRef, language: LanguageService, private pipe: PipeService, private transport: Transport) {
        super(container);
        ViewUtil.addClasses(container.element, 'd-flex flex-column');

        this.tabs = this.addDestroyable(new SelectListItems(language));
        this.tabs.add(new SelectListItem('block.details', 0, 'details'));
        this.requestTab = this.tabs.add(new SelectListItem('block.transaction.request', 1, 'request'));
        this.tabs.complete(0);

        /*
        <mat-tab-group class="tabs-stretch no-border" (selectedIndexChange)="selectedIndex = $event" [selectedIndex]="selectedIndex">
    <mat-tab label="{{'block.details' | viTranslate}}"></mat-tab>
    <mat-tab label="{{'block.transaction.request' | viTranslate}}" [disabled]="!wrapper.isHasRequest"></mat-tab>
</mat-tab-group>

        */
    }

    //--------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    //--------------------------------------------------------------------------

    private commitTransactionProperties(): void {
        let value = null;

        let transaction = this.wrapper = new LedgerBlockTransactionWrapper(this.transaction);
        this.requestTab.isEnabled = this.wrapper.isHasRequest;

        value = transaction.requestData;
        if (value !== this.request) {
            this.request = value;
        }
        value = transaction.requestRaw;
        if (value !== this.requestRaw) {
            this.requestRaw = value;
        }

        value = transaction.responseData;
        if (value !== this.response) {
            this.response = value;
        }

        value = this.pipe.language.translate(`block.transaction.validationCode.${transaction.validationCode}`);
        value += ` [ ${transaction.validationCode} ]`;
        if (value !== this.validationCode) {
            this.validationCode = value;
        }

        value = transaction.isValid;
        if (value !== this.isValid) {
            this.isValid = value;
        }

        value = transaction.requestAlgorithm;
        if (value !== this.requestAlgorithm) {
            this.requestAlgorithm = value;
        }

        value = transaction.requestUserId;
        if (value !== this.requestUserId) {
            this.requestUserId = value;
        }
        value = transaction.responseErrorMessage;
        if (value !== this.responseErrorMessage) {
            this.responseErrorMessage = value;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public blockOpen(item: number): void {
        this.transport.send(new BlockOpenCommand(item));
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get transaction(): LedgerBlockTransaction {
        return this._transaction;
    }
    @Input()
    public set transaction(value: LedgerBlockTransaction) {
        if (value === this._transaction) {
            return;
        }
        this._transaction = value;
        if (this._transaction) {
            this.commitTransactionProperties();
        }
    }
}

