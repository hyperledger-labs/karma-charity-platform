import { Module } from '@nestjs/common';
import { CoinBurnHandler } from './handler/CoinBurnHandler';
import { CoinEmitHandler } from './handler/CoinEmitHandler';
import { CoinTransferHandler } from './handler/CoinTransferHandler';
import { CoinService } from './service/CoinService';

@Module({
    controllers: [CoinEmitHandler, CoinBurnHandler, CoinTransferHandler],
    providers: [CoinService]
})
export class CoinModule {}
