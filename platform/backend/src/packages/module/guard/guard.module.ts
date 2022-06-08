import { Module } from '@nestjs/common';
import { DatabaseModule } from '@project/module/database';
import { SharedModule } from '@project/module/shared';
import { UserGuard } from './UserGuard';

@Module({
    imports: [SharedModule, DatabaseModule],
    providers: [UserGuard]
})
export class GuardModule { }
