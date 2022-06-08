import { Module } from '@nestjs/common';
import { GenesisGetHandler } from './GenesisGetHandler';
import { GenesisService } from './GenesisService';
import { UserModule } from '../user/UserModule';
import { CompanyModule } from '../company/CompanyModule';

@Module({
    imports: [UserModule, CompanyModule, GenesisModule],
    controllers: [GenesisGetHandler],
    providers: [GenesisService],
    exports: [GenesisService]
})
export class GenesisModule {}
