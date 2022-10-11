import { ObjectUtil, TransformUtil } from '@ts-core/common';
import { Exclude, Expose, Type, ClassTransformOptions } from 'class-transformer';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, JoinColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyEntity } from '../company';
import { PaymentAggregator, PaymentAggregatorType } from '@project/common/platform/payment/aggregator';
import { TransformGroup } from '../TransformGroup';

@Entity({ name: 'company_payment_aggregator' })
export class CompanyPaymentAggregatorEntity implements PaymentAggregator {
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

    @Column({ type: 'varchar' })
    @IsString()
    public uid: string;

    @Column({ type: 'varchar' })
    @IsEnum(PaymentAggregatorType)
    public type: PaymentAggregatorType;

    @Column({ name: 'callback_url', type: 'varchar' })
    @IsOptional()
    @IsString()
    public callbackUrl?: string;

    @Exclude()
    @Column({ type: 'varchar' })
    @IsString()
    public key: string;

    @Exclude()
    @OneToOne(() => CompanyEntity, company => company.paymentAggregator)
    @JoinColumn({ name: 'company_id' })
    @Type(() => CompanyEntity)
    public company: CompanyEntity;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data?: Partial<PaymentAggregator>) {
        if (!_.isNil(data)) {
            ObjectUtil.copyPartial(data, this);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------


    public toObject(options?: ClassTransformOptions): PaymentAggregator {
        return TransformUtil.fromClass<PaymentAggregator>(this, options);
    }

}
