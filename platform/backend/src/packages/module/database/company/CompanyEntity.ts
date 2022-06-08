import { LedgerCompany } from '@project/common/ledger/company';
import { Company, CompanyStatus } from '@project/common/platform/company';
import { TransformUtil } from '@ts-core/common/util';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, OneToMany, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserCompany } from '@project/common/platform/user';
import { UserEntity, UserRoleEntity } from '../user';
import { CompanyPreferencesEntity } from './CompanyPreferencesEntity';
import { CompanyPaymentAggregatorEntity } from './CompanyPaymentAggregatorEntity';
import { ProjectEntity } from '../project';

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

    @Transform(params => (params.value ? params.value.toObject() : null), { toPlainOnly: true })
    @OneToOne(
        () => CompanyPreferencesEntity,
        preferences => preferences.company,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    public preferences: CompanyPreferencesEntity;

    @Transform(params => (params.value ? params.value.toObject() : null), { toPlainOnly: true })
    @OneToOne(
        () => CompanyPaymentAggregatorEntity,
        paymentAggregator => paymentAggregator.company,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    public paymentAggregator: CompanyPaymentAggregatorEntity;

    @Exclude()
    @OneToMany(() => UserEntity, item => item.company)
    public users: Array<UserEntity>;

    @Exclude()
    @OneToMany(() => ProjectEntity, item => item.company)
    public projects: Array<ProjectEntity>;

    @Exclude()
    @OneToMany(() => UserRoleEntity, item => item.company)
    public userRoles?: Array<UserRoleEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(): Company {
        return TransformUtil.fromClass<Company>(this, { excludePrefixes: ['__'] });
    }

    public toUserObject(): UserCompany {
        let item = { ...this.toObject(), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
    }

}
