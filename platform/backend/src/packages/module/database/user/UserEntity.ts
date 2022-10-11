import { LedgerUser } from '@project/common/ledger/user';
import { LoginResource } from '@project/common/platform/api/login';
import { CompanyUser } from '@project/common/platform/company';
import { ProjectUser } from '@project/common/platform/project';
import { User, UserResource, UserStatus, UserType } from '@project/common/platform/user';
import { UserRoleEntity } from '@project/module/database/user';
import { TransformUtil, ValidateUtil } from '@ts-core/common';
import { Exclude, Expose, ClassTransformOptions, Type } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Column, CreateDateColumn, BeforeUpdate, BeforeInsert, JoinColumn, OneToMany, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyEntity } from '../company';
import { FavoriteEntity } from '../favorite';
import { PaymentEntity } from '../payment';
import { ProjectEntity } from '../project/ProjectEntity';
import { TransformGroup } from '../TransformGroup';
import { UserCryptoKeyEntity } from './UserCryptoKeyEntity';
import { UserHashEntity } from './UserHashEntity';
import { UserPreferencesEntity } from './UserPreferencesEntity';

@Entity({ name: 'user' })
export class UserEntity implements User {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    @PrimaryGeneratedColumn()
    @IsOptional()
    @IsNumber()
    public id: number;

    @Column()
    @Index({ unique: true })
    @IsString()
    public uid: string;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @Column()
    @Index({ unique: true })
    @IsString()
    public login: string;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @Column({ type: 'varchar' })
    @IsEnum(UserResource)
    public resource: UserResource;

    @Column({ type: 'varchar' })
    @IsEnum(UserType)
    public type: UserType;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @Column({ type: 'varchar' })
    @IsEnum(UserStatus)
    public status: UserStatus;

    @Column({ name: 'ledger_uid', nullable: true })
    @Index({ unique: true })
    @IsOptional()
    @Matches(LedgerUser.UID_REGXP)
    public ledgerUid?: string;

    @Exclude()
    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    public password?: string;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @Expose({ groups: [TransformGroup.PRIVATE] })
    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @OneToOne(
        () => UserPreferencesEntity,
        preferences => preferences.user,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    @Type(() => UserPreferencesEntity)
    public preferences: UserPreferencesEntity;

    @Exclude()
    @OneToOne(
        () => UserCryptoKeyEntity,
        preferences => preferences.user,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    @Type(() => UserCryptoKeyEntity)
    public cryptoKey: UserCryptoKeyEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, company => company.users, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    @Type(() => CompanyEntity)
    public company?: CompanyEntity;

    @Exclude()
    @Column({ name: 'company_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public companyId?: number;

    @Exclude()
    @OneToMany(() => ProjectEntity, item => item.user)
    @Type(() => ProjectEntity)
    public projects?: Array<ProjectEntity>;

    @Exclude()
    @OneToMany(() => PaymentEntity, item => item.user)
    @Type(() => PaymentEntity)
    public payments?: Array<PaymentEntity>;

    @Exclude()
    @Type(() => UserRoleEntity)
    public userRoles?: Array<UserRoleEntity>;

    @Exclude()
    @OneToMany(() => UserHashEntity, item => item.user, { cascade: true })
    @Type(() => UserHashEntity)
    public hashes: Array<UserHashEntity>;

    @Exclude()
    @OneToMany(() => FavoriteEntity, item => item.user)
    @Type(() => FavoriteEntity)
    public favorites?: Array<FavoriteEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toString(): string {
        return `${this.login}(${this.notifableUid})`;
    }

    public toObject(options?: ClassTransformOptions): User {
        return TransformUtil.fromClass<User>(this, options);
    }

    public toCompanyObject(options?: ClassTransformOptions): CompanyUser {
        let item = { ...this.toObject(options), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
    }

    public toProjectObject(options?: ClassTransformOptions): ProjectUser {
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

    @Exclude({ toPlainOnly: true })
    public get notifableUid(): number {
        return this.id;
    }

    @Exclude({ toPlainOnly: true })
    public get isDonor(): boolean {
        return this.type === UserType.DONOR;
    }
    @Exclude({ toPlainOnly: true })
    public get isEditor(): boolean {
        return this.type === UserType.EDITOR;
    }
    @Exclude({ toPlainOnly: true })
    public get isUndefined(): boolean {
        return this.type === UserType.UNDEFINED;
    }
    @Exclude({ toPlainOnly: true })
    public get isAdministrator(): boolean {
        return this.type === UserType.ADMINISTRATOR;
    }
    @Exclude({ toPlainOnly: true })
    public get isCompanyWorker(): boolean {
        return this.type === UserType.COMPANY_WORKER;
    }
    @Exclude({ toPlainOnly: true })
    public get isCompanyManager(): boolean {
        return this.type === UserType.COMPANY_MANAGER;
    }
}
