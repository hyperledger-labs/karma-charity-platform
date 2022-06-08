import { CommonModule } from '@angular/common';
import { NgModule, NgModuleRef } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BlockOpenHandler, BlocksOpenHandler } from './service';
import { TransportLazyModule } from '@ts-core/angular';
import { BlockOpenCommand, BlocksOpenCommand } from './transport';
import { Transport } from '@ts-core/common/transport';
import { BlockDetailsComponent } from './component/block-details/block-details.component';
import { BlockLastComponent } from './component/block-last/block-last.component';
import { BlocksComponent } from './component/blocks/blocks.component';
import { BlocksLastComponent } from './component/blocks-last/blocks-last.component';
import { TransactionModule } from '@feature/transaction';
import { EventModule } from '@feature/event';
import { MatProgressBarModule } from '@angular/material/progress-bar';

//--------------------------------------------------------------------------
//
// 	Constants
//
//--------------------------------------------------------------------------

const providers = [];
const declarations = [BlockDetailsComponent, BlockLastComponent, BlocksComponent, BlocksLastComponent];

@NgModule({
    imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatProgressBarModule, TransactionModule, EventModule, SharedModule],
    exports: declarations,
    declarations,
    providers
})
export class BlockModule extends TransportLazyModule<BlockModule> {
    //--------------------------------------------------------------------------
    //
    // 	Public Static Properties
    //
    //--------------------------------------------------------------------------

    public static ID = 'BlockModule';
    public static COMMANDS = [BlockOpenCommand.NAME, BlocksOpenCommand.NAME];

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(reference: NgModuleRef<BlockModule>, transport: Transport, open: BlockOpenHandler, opens: BlocksOpenHandler) {
        super(reference, transport);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get id(): string {
        return BlockModule.ID;
    }

    public get commands(): Array<string> {
        return BlockModule.COMMANDS;
    }
}
