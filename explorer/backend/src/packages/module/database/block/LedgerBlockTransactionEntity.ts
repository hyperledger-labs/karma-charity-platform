import { ObjectUtil } from '@ts-core/common/util';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsUUID, IsDate, IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Index, JoinColumn, ManyToOne, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LedgerBlockEntity } from './LeggerBlockEntity';
import {
    LedgerBlockTransaction,
    ILedgerBlockTransactionResponsePayload,
    ILedgerBlockTransactionRequestPayload,
    ILedgerBlockTransactionChaincode,
} from '@hlf-explorer/common/ledger';

@Entity('ledger_block_transaction')
@Index(['hash', 'blockId', 'requestId', 'requestUserId', 'ledgerId'])
@Index(['uid', 'ledgerId'], { unique: true })
export class LedgerBlockTransactionEntity implements LedgerBlockTransaction {
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
    @IsString()
    public channel: string;

    @Column({ name: 'block_number' })
    @IsNumber()
    public blockNumber: number;

    @Column({ name: 'created_date' })
    @IsDate()
    @Type(() => Date)
    public createdDate: Date;

    @Column({ name: 'validation_code' })
    @IsNumber()
    public validationCode: number;

    @Column({ type: 'json', nullable: true })
    @IsOptional()
    public chaincode: ILedgerBlockTransactionChaincode;

    @Column({ type: 'json', nullable: true })
    @IsOptional()
    public request: ILedgerBlockTransactionRequestPayload;

    @Column({ type: 'json', nullable: true })
    @IsOptional()
    public response: ILedgerBlockTransactionResponsePayload;

    @Column({ name: 'request_id', nullable: true })
    @IsOptional()
    @IsUUID()
    public requestId: string;

    @Column({ name: 'request_name', nullable: true })
    @IsOptional()
    @IsString()
    public requestName: string;

    @Column({ name: 'request_user_id', nullable: true })
    @IsOptional()
    @IsString()
    public requestUserId: string;

    @Column({ name: 'response_error_code', nullable: true })
    @IsOptional()
    @IsNumber()
    public responseErrorCode: number;

    @Column({ name: 'is_batch', nullable: true })
    @IsOptional()
    @IsBoolean()
    public isBatch?: boolean;

    @Column({ name: 'block_mined', nullable: true })
    @IsOptional()
    @IsNumber()
    public blockMined?: number;

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

    public update(data: Partial<LedgerBlockTransaction>): void {
        ObjectUtil.copyProperties(data, this);
    }
}
