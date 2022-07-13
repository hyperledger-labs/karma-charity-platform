import { LedgerProject } from '@project/common/ledger/project';
import { Project, ProjectStatus } from '@project/common/platform/project';
import { TransformUtil, ValidateUtil } from '@ts-core/common/util';
import { Exclude, Expose, ClassTransformOptions, Type } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, BaseEntity, ManyToOne, BeforeUpdate, BeforeInsert, JoinColumn, OneToMany, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserProject } from '@project/common/platform/user';
import { UserEntity, UserRoleEntity } from '../user';
import { ProjectPreferencesEntity } from './ProjectPreferencesEntity';
import { CompanyEntity } from '../company';
import { PaymentEntity, PaymentTransactionEntity } from '../payment';
import { AccountEntity } from '../account';
import { Account, AccountType } from '@project/common/platform/account';
import { IProjectBalance } from '@project/common/platform/project';
import { ProjectPurposeEntity } from './ProjectPurposeEntity';
import { ExtendedError } from '@ts-core/common/error';
import { ProjectUtil } from '@project/module/project/util';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity implements Project {
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
    @IsEnum(ProjectStatus)
    public status: ProjectStatus;

    @Column({ name: 'ledger_uid' })
    @Index({ unique: true })
    @IsOptional()
    @Matches(LedgerProject.UID_REGXP)
    public ledgerUid?: string;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @OneToOne(
        () => ProjectPreferencesEntity,
        preferences => preferences.project,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    @Type(() => ProjectPreferencesEntity)
    public preferences: ProjectPreferencesEntity;

    @Column({ name: "user_id" })
    @IsNumber()
    public userId: number;

    @Column({ name: "company_id" })
    @IsNumber()
    public companyId: number;

    @OneToMany(() => ProjectPurposeEntity, item => item.project, { cascade: true, eager: true })
    @ValidateNested()
    @Type(() => ProjectPurposeEntity)
    public purposes: Array<ProjectPurposeEntity>;

    @Exclude()
    @ManyToOne(() => UserEntity, user => user.projects)
    @ValidateNested()
    @JoinColumn({ name: "user_id" })
    @Type(() => UserEntity)
    public user: UserEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, company => company.projects)
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    @Type(() => CompanyEntity)
    public company?: CompanyEntity;

    @Exclude()
    @OneToMany(() => AccountEntity, item => item.project, { cascade: true, eager: true })
    @Type(() => AccountEntity)
    public accounts?: Array<AccountEntity>;

    @Exclude()
    @OneToMany(() => PaymentTransactionEntity, item => item.project)
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

    public toObject(options?: ClassTransformOptions): Project {
        return TransformUtil.fromClass<Project>(this, options);
    }

    public toUserObject(options?: ClassTransformOptions): UserProject {
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
    public get balance(): IProjectBalance {
        return ProjectUtil.getBalance(this);
    }
}
