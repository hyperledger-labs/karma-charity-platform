//--------------------------------------------------------------------------
//
// 	Imports
//
//--------------------------------------------------------------------------

import { BlockModule } from '@feature/block';
import { EventModule } from '@feature/event';
import { TransactionModule } from '@feature/transaction';

export const TRANSPORT_LAZY_MODULES = [
    {
        id: BlockModule.ID,
        commands: BlockModule.COMMANDS,
        path: async () => (await import('@feature/block')).BlockModule
    },
    {
        id: EventModule.ID,
        commands: EventModule.COMMANDS,
        path: async () => (await import('@feature/event')).EventModule
    },
    {
        id: TransactionModule.ID,
        commands: TransactionModule.COMMANDS,
        path: async () => (await import('@feature/transaction')).TransactionModule
    },

];
