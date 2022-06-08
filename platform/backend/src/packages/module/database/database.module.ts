import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './service';

@Module({
    imports: [TypeOrmModule],
    exports: [DatabaseService],
    providers: [DatabaseService]
})
export class DatabaseModule {}
