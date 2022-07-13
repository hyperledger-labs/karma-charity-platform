import { ObjectUtil, TransformUtil, ValidateUtil } from '@ts-core/common/util';
import { Exclude, ClassTransformOptions, Type } from 'class-transformer';
import { IsString, IsJSON, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, OneToMany, BeforeUpdate, BeforeInsert, OneToOne, JoinColumn, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { TypeormJSONTransformer } from '@ts-core/backend/database/typeorm';
import { UserEntity } from '../user';
import { Payment, PaymentStatus } from '@project/common/platform/payment';
import { PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { PaymentTransactionEntity } from './PaymentTransactionEntity';

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

    @Column({ name: 'transaction_id' })
    @IsString()
    public transactionId: string;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @Column({ name: 'user_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public userId?: number;

    @Column({ name: 'reference_id', nullable: true  })
    @IsOptional()
    @IsString()
    public referenceId?: string;

    @ManyToOne(() => UserEntity, user => user.payments)
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "user_id" })
    @Type(() => UserEntity)
    public user?: UserEntity;

    @OneToMany(() => PaymentTransactionEntity, transaction => transaction.payment, { cascade: true, eager: true })
    @ValidateNested()
    @Type(() => PaymentTransactionEntity)
    public transactions: Array<PaymentTransactionEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Payment {
        return TransformUtil.fromClass<Payment>(this, options);
    }

    @BeforeUpdate()
    @BeforeInsert()
    public validate(): void {
        ValidateUtil.validate(this);
    }
}
