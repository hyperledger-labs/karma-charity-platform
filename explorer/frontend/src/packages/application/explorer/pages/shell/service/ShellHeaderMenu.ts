import { SelectListItem, SelectListItems, ISelectListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { RouterService } from '@core/service';
import { Transport, TransportCommand } from '@ts-core/common/transport';
import { BlocksOpenCommand } from '@feature/block/transport';
import { TransactionsOpenCommand } from '@feature/transaction/transport';
import { EventsOpenCommand } from '@feature/event/transport';

@Injectable()
export class ShellHeaderMenu extends SelectListItems<ISelectListItem<string>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static MAIN = 0;
    private static BLOCKS = 1;
    private static TRANSACTIONS = 1;
    private static EVENTS = 2;


    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, router: RouterService) {
        super(language);


        // this.add(new SectionListItem('tab.main', ShellHeaderMenu.MAIN, `/${RouterService.MAIN_URL}`, '✦'));
        this.add(new SectionListItem('tab.blocks', ShellHeaderMenu.MAIN, BlocksOpenCommand.NAME, '✷'));
        this.add(new SectionListItem('tab.transactions', ShellHeaderMenu.TRANSACTIONS, TransactionsOpenCommand.NAME, '❂'));
        this.add(new SectionListItem('tab.events', ShellHeaderMenu.EVENTS, EventsOpenCommand.NAME, '✺'));

        for (let item of this.collection) {
            item.action = item => transport.send(new TransportCommand(item.data));

            // item.action = item => router.navigate(item.data);
            // item.checkSelected = item => router.isUrlActive(item.data, false);
        }
        // router.finished.pipe(takeUntil(this.destroyed)).subscribe(() => this.refreshSelection());

        this.complete();
        this.refresh();
    }
}

export class SectionListItem extends SelectListItem<string> {
    constructor(translationId: string, sortIndex: number, data: string, iconId: string, className?: string, selectedClassName: string = 'active') {
        super(translationId, sortIndex, data);
        this.iconId = iconId;
        this.className = className;
        this.selectedClassName = selectedClassName;
    }
}
