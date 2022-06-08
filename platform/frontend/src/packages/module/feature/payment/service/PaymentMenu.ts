import { ListItems, IListItem, ListItem } from '@ts-core/angular';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Transport } from '@ts-core/common/transport';
import { UserService } from '../../../core/service';
import { Payment } from '@project/common/platform/payment';
import { UserOpenCommand } from '../../user/transport';

@Injectable({ providedIn: 'root' })
export class PaymentMenu extends ListItems<IListItem<void>> {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static USER = 10;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService, transport: Transport, private user: UserService) {
        super(language);

        let item: MenuListItem = null;

        item = new ListItem('user.user', PaymentMenu.USER, null, 'fas fa-user me-2');
        item.checkEnabled = (item, payment) => !_.isNil(payment.userId);
        item.action = (item, payment) => transport.send(new UserOpenCommand(payment.userId));
        this.add(item);

        this.complete();
    }
}

class MenuListItem extends ListItem<void> {
    action: (item: ListItem, company: Payment) => void;
    checkEnabled: (item: ListItem, company: Payment) => boolean;
}
