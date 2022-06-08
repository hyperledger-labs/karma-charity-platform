import { Project } from '@project/common/platform/project';
import { ObjectUtil, TransformUtil } from '@ts-core/common/util';
import { Exclude } from 'class-transformer';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, JoinColumn, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyEntity } from './index';
import { PaymentAggregator, PaymentAggregatorType } from '@project/common/platform/payment/aggregator';

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

    @Exclude()
    @Column({ type: 'varchar' })
    @IsString()
    public key: string;

    @Exclude()
    @OneToOne(() => CompanyEntity, company => company.paymentAggregator)
    @JoinColumn({ name: 'company_id' })
    public company: CompanyEntity;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data?: Partial<PaymentAggregator>) {
        if (!_.isNil(data)) {
            this.update(data);
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public update(data: Partial<PaymentAggregator>): void {
        ObjectUtil.copyProperties(data, this);
    }

    public toObject(): PaymentAggregator {
        return TransformUtil.fromClass<PaymentAggregator>(this, { excludePrefixes: ['__'] });
    }

}
