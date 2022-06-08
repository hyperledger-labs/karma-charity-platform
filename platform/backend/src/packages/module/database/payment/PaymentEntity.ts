import { ObjectUtil, TransformUtil } from '@ts-core/common/util';
import { Exclude } from 'class-transformer';
import { IsString, IsJSON, IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { TypeormJSONTransformer, TypeormDecimalTransformer } from '@ts-core/backend/database/typeorm';
import { CompanyEntity } from '../company';
import { UserEntity } from '../user';
import { ProjectEntity } from '../project';
import { Payment, PaymentCurrency, PaymentStatus } from '@project/common/platform/payment';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { LedgerCoinId } from '@project/common/ledger/coin';

@Entity({ name: 'payment' })
export class PaymentEntity implements Payment {
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
    public type: PaymentAggregatorType;

    @Column({ type: 'varchar' })
    @IsString()
    public status: PaymentStatus;

    @Exclude()
    @Column({ type: 'json', transformer: TypeormJSONTransformer.instance })
    @IsJSON()
    public details: any;

    @Column({ type: 'numeric', transformer: TypeormDecimalTransformer.instance })
    @IsString()
    public amount: string;

    @Column({ type: 'varchar' })
    @IsEnum(LedgerCoinId)
    public currency: PaymentCurrency;

    @Column({ name: 'company_id' })
    @IsNumber()
    public companyId: number;

    @Column({ name: 'transaction_id' })
    @IsString()
    public transactionId: string;

    @Column({ name: 'user_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public userId?: number;

    @Column({ name: 'project_id' })
    @IsOptional()
    @IsNumber()
    public projectId?: number;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @Exclude()
    @ManyToOne(() => UserEntity, user => user.payments)
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "user_id" })
    public user?: UserEntity;

    @Exclude()
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    public company?: CompanyEntity;

    @Exclude()
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "project_id" })
    public project?: ProjectEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public update(data: Partial<Payment>): void {
        ObjectUtil.copyProperties(data, this);
    }

    public toObject(): Payment {
        return TransformUtil.fromClass<Payment>(this, { excludePrefixes: ['__'] });
    }
}
