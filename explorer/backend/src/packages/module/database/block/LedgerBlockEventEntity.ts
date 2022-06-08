import { ObjectUtil } from '@ts-core/common/util';
import { Exclude, Type } from 'class-transformer';
import { IsDate, IsUUID, IsNumber, IsOptional, IsBoolean, IsString } from 'class-validator';
import { Column, Index, JoinColumn, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LedgerBlockEntity } from './LeggerBlockEntity';
import { LedgerBlockEvent } from '@hlf-explorer/common/ledger';
import { ITransportEvent } from '@ts-core/common/transport';

@Entity('ledger_block_event')
@Index(['uid', 'blockId', 'ledgerId', 'name'])
@Index(['uid', 'ledgerId'], { unique: true })
export class LedgerBlockEventEntity<T = any> implements LedgerBlockEvent<T> {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @Exclude()
    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Column()
    @IsUUID()
    public uid: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    public name: string;

    @Column({ name: 'transaction_hash' })
    @IsString()
    public transactionHash: string;

    @Column({ name: 'transaction_validation_code', nullable: true })
    @IsNumber()
    public transactionValidationCode: number;

    @Column()
    @IsString()
    public channel: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    public chaincode: string;

    @Column({ type: 'json', nullable: true })
    @IsOptional()
    @IsString()
    public data?: ITransportEvent<T>;

    @Column({ name: 'block_number' })
    @IsNumber()
    public blockNumber: number;

    @Column({ name: 'created_date' })
    @IsDate()
    @Type(() => Date)
    public createdDate: Date;

    @Exclude()
    @ManyToOne(
        () => LedgerBlockEntity,
        item => item.transactions
    )
    @JoinColumn({ name: 'block_id' })
    public block: LedgerBlockEntity;

    @Exclude()
    @Column({ name: 'block_id' })
    @IsNumber()
    public blockId: number;

    @Exclude()
    @Column({ name: 'ledger_id' })
    @IsNumber()
    public ledgerId: number;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public update(data: Partial<LedgerBlockEvent>): void {
        ObjectUtil.copyProperties(data, this);
    }
}
