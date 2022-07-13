import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TransportLazyModule } from '@ts-core/angular';
import { PaymentWidgetOpenHandler, PaymentOpenHandler } from './service';
import { Transport } from '@ts-core/common/transport';
import { PaymentWidgetOpenCommand, PaymentOpenCommand } from './transport';
import { PaymentContainerComponent, PaymentWidgetContainer, PaymentTransactionsComponent, PaymentDetailsComponent, PaymentListComponent } from './component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PaymentAmountPipe } from './pipe';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [PaymentAmountPipe, PaymentContainerComponent, PaymentTransactionsComponent, PaymentListComponent, PaymentWidgetContainer, PaymentDetailsComponent];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatMenuModule,
        SharedModule,
    ],
    exports: declarations,
    declarations,
    providers
})
export class PaymentModule extends TransportLazyModule<PaymentModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'PaymentModule';
    public static COMMANDS = [PaymentOpenCommand.NAME, PaymentWidgetOpenCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<PaymentModule>, transport: Transport, widget: PaymentWidgetOpenHandler, open: PaymentOpenHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return PaymentModule.ID;
    }

    public get commands(): Array<string> {
        return PaymentModule.COMMANDS;
    }
}
