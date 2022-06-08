import { LedgerBlock } from '@hlf-explorer/common/ledger';
import { ObjectUtil } from '@ts-core/common/util';
import { Exclude, Type } from 'class-transformer';
import { IsDefined, IsUUID, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, JoinTable, OneToMany, Index, JoinColumn, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LedgerEntity } from '../ledger/LedgerEntity';
import { LedgerBlockEventEntity } from './LedgerBlockEventEntity';
import { LedgerBlockTransactionEntity } from './LedgerBlockTransactionEntity';
import { IFabricBlock } from '@hlf-core/api';

@Entity('ledger_block')
@Index(['uid', 'hash', 'number', 'ledgerId'])
@Index(['uid', 'ledgerId'], { unique: true })
export class LedgerBlockEntity implements LedgerBlock {
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

    @Column()
    @IsString()
    public hash: string;

    @Column()
    @IsNumber()
    public number: number;

    @Column({ name: 'created_date' })
    @IsDate()
    @Type(() => Date)
    public createdDate: Date;

    @Column({ name: 'raw_data', type: 'json' })
    @IsDefined()
    public rawData: IFabricBlock;

    @Column({ name: 'is_batch', nullable: true })
    @IsOptional()
    @IsBoolean()
    public isBatch?: boolean;

    @Type(() => LedgerBlockTransactionEntity)
    @OneToMany(
        () => LedgerBlockTransactionEntity,
        item => item.block,
        { cascade: true, eager: true }
    )
    @JoinTable()
    public transactions: Array<LedgerBlockTransactionEntity>;

    @Type(() => LedgerBlockEventEntity)
    @OneToMany(
        () => LedgerBlockEventEntity,
        item => item.block,
        { cascade: true, eager: true }
    )
    @JoinTable()
    public events: Array<LedgerBlockEventEntity>;

    @Column({ name: 'ledger_id' })
    @IsNumber()
    public ledgerId: number;

    @ManyToOne(
        () => LedgerEntity,
        item => item.blocksEntity
    )
    @JoinColumn({ name: 'ledger_id' })
    public ledger: LedgerEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public update(data: Partial<LedgerBlock>): void {
        ObjectUtil.copyProperties(data, this);
    }
}
