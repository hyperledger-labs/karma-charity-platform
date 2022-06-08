import { Module, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';

const providers = [ParseIntPipe, ParseUUIDPipe]
@Module({
    providers,
    exports: [...providers]
})
export class SharedModule {}
