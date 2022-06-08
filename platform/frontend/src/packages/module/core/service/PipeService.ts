import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LanguageService } from '@ts-core/frontend/language';
import { PipeBaseService } from '@ts-core/angular';
import { UserTitlePipe, RolePipe, AccountPipe, AmountPipe } from '../../shared/pipe';
import { PaymentAmountPipe } from '../../feature/payment/pipe';

@Injectable({ providedIn: 'root' })
export class PipeService extends PipeBaseService {
    //--------------------------------------------------------------------------
    //
    // 	Constants
    //
    //--------------------------------------------------------------------------

    private static ROLE: RolePipe;
    private static AMOUNT: AmountPipe;
    private static ACCOUNT: AccountPipe;
    private static USER_TITLE: UserTitlePipe;

    private static PAYMENT_AMOUNT: PaymentAmountPipe;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(language: LanguageService, sanitizer: DomSanitizer) {
        super(language, sanitizer);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get role(): RolePipe {
        if (!PipeService.ROLE) {
            PipeService.ROLE = new RolePipe(this.language);
        }
        return PipeService.ROLE;
    }

    public get amount(): AmountPipe {
        if (!PipeService.AMOUNT) {
            PipeService.AMOUNT = new AmountPipe();
        }
        return PipeService.AMOUNT;
    }

    public get paymentAmount(): PaymentAmountPipe {
        if (!PipeService.PAYMENT_AMOUNT) {
            PipeService.PAYMENT_AMOUNT = new PaymentAmountPipe();
        }
        return PipeService.PAYMENT_AMOUNT;
    }

    public get account(): AccountPipe {
        if (!PipeService.ACCOUNT) {
            PipeService.ACCOUNT = new AccountPipe(this.language);
        }
        return PipeService.ACCOUNT;
    }

    public get userTitle(): UserTitlePipe {
        if (!PipeService.USER_TITLE) {
            PipeService.USER_TITLE = new UserTitlePipe(this.language);
        }
        return PipeService.USER_TITLE;
    }

}
