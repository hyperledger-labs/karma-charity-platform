import { TransformUtil } from '@ts-core/common';
import { Type, Exclude, ClassTransformOptions } from 'class-transformer';
import { IsString, IsBoolean, ValidateNested, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CreateDateColumn, JoinColumn, ManyToOne, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { PaymentAccountId, PaymentTransactionType } from '@project/common/platform/payment';
import { LedgerCoinId } from '@project/common/ledger/coin';
import { PaymentTransaction } from '@project/common/platform/payment';
import { PaymentEntity } from './PaymentEntity';
import { ProjectEntity } from '../project';
import { CompanyEntity } from '../company';

@Entity({ name: 'payment_transaction' })
export class PaymentTransactionEntity implements PaymentTransaction {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Column({ type: 'varchar' })
    @IsString()
    public type: PaymentTransactionType;

    @Column({ type: 'numeric' })
    @IsString()
    public amount: string;

    @Column({ type: 'varchar', name: 'coin_id' })
    @IsEnum(LedgerCoinId)
    public coinId: LedgerCoinId;

    @Column({ name: 'payment_id' })
    @IsNumber()
    @IsOptional()
    public paymentId: number;

    @Column({ name: 'ledger_transaction', nullable: true })
    @IsOptional()
    @IsString()
    public ledgerTransaction: string;;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @Column({ name: 'activated_date', nullable: true })
    @IsOptional()
    @IsDate()
    public activatedDate: Date;

    @Column({ type: 'varchar' })
    @IsEnum(PaymentAccountId)
    public debet: PaymentAccountId;

    @Column({ type: 'varchar' })
    @IsEnum(PaymentAccountId)
    public credit: PaymentAccountId;

    @Column({ name: 'project_id' })
    @IsOptional()
    @IsNumber()
    public projectId?: number;

    @Column({ name: 'company_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public companyId?: number;

    @ManyToOne(() => PaymentEntity, payment => payment.transactions)
    @JoinColumn({ name: 'payment_id' })
    @Type(() => PaymentEntity)
    public payment: PaymentEntity;

    @ManyToOne(() => CompanyEntity, company => company.transactions)
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    @Type(() => CompanyEntity)
    public company?: CompanyEntity;

    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "project_id" })
    @Type(() => ProjectEntity)
    public project?: ProjectEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): PaymentTransaction {
        return TransformUtil.fromClass<PaymentTransaction>(this, options);
    }
}
