import { LedgerCompany } from '@project/common/ledger/company';
import { Company, CompanyType, CompanyStatus } from '@project/common/platform/company';
import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import { Exclude, Expose, Type, ClassTransformOptions } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, OneToMany, CreateDateColumn, BeforeUpdate, BeforeInsert, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserCompany } from '@project/common/platform/user';
import { UserEntity, UserRoleEntity } from '../user';
import { CompanyPreferencesEntity } from './CompanyPreferencesEntity';
import { CompanyPaymentAggregatorEntity } from './CompanyPaymentAggregatorEntity';
import { ProjectEntity } from '../project';
import { PaymentTransactionEntity } from '../payment';
import { AccountEntity } from '../account';
import { Accounts, AccountType } from '@project/common/platform/account';
import { ExtendedError } from '@ts-core/common/error';

@Entity({ name: 'company' })
export class CompanyEntity implements Company {
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
    @IsEnum(CompanyType)
    public type: CompanyType;

    @Column({ type: 'varchar' })
    @IsEnum(CompanyStatus)
    public status: CompanyStatus;

    @Column({ name: 'ledger_uid' })
    @Index({ unique: true })
    @IsOptional()
    @Matches(LedgerCompany.UID_REGXP)
    public ledgerUid?: string;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @OneToOne(
        () => CompanyPreferencesEntity,
        preferences => preferences.company,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    @Type(() => CompanyPreferencesEntity)
    public preferences: CompanyPreferencesEntity;

    @OneToOne(
        () => CompanyPaymentAggregatorEntity,
        paymentAggregator => paymentAggregator.company,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    @Type(() => CompanyPaymentAggregatorEntity)
    public paymentAggregator: CompanyPaymentAggregatorEntity;

    @Exclude()
    @OneToMany(() => UserEntity, item => item.company)
    @Type(() => UserEntity)
    public users: Array<UserEntity>;

    @Exclude()
    @OneToMany(() => ProjectEntity, item => item.company)
    @Type(() => ProjectEntity)
    public projects: Array<ProjectEntity>;

    @Exclude()
    @OneToMany(() => AccountEntity, item => item.company)
    @Type(() => AccountEntity)
    public accounts?: Array<AccountEntity>;

    @Exclude()
    @OneToMany(() => PaymentTransactionEntity, item => item.company)
    @Type(() => PaymentTransactionEntity)
    public transactions?: Array<PaymentTransactionEntity>;

    @Exclude()
    @Type(() => UserRoleEntity)
    public userRoles?: Array<UserRoleEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(options?: ClassTransformOptions): Company {
        return TransformUtil.fromClass<Company>(this, options);
    }

    public toUserObject(options?: ClassTransformOptions): UserCompany {
        let item = { ...this.toObject(options), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
    }

    @BeforeUpdate()
    @BeforeInsert()
    public validate(): void {
        ValidateUtil.validate(this);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    @Expose()
    public get balance(): Accounts {
        if (_.isEmpty(this.accounts)) {
            return null;
        }

        let item: Accounts = {} as any;
        for (let account of this.accounts) {
            if (account.type === AccountType.COLLECTED) {
                item[account.coinId] = account.amount
            }
        }
        return item;
    }

}
