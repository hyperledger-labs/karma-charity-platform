import { LedgerUser } from '@project/common/ledger/user';
import { LoginResource } from '@project/common/platform/api/login';
import { CompanyUser } from '@project/common/platform/company';
import { ProjectUser } from '@project/common/platform/project';
import { User, UserStatus, UserType } from '@project/common/platform/user';
import { UserRoleEntity } from '@project/module/database/user';
import { TransformUtil } from '@ts-core/common/util';
import { INotifable } from '@ts-core/notification';
import { Exclude, Transform } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import * as _ from 'lodash';
import { Column, CreateDateColumn, JoinColumn, OneToMany, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyEntity } from '../company';
import { PaymentEntity } from '../payment';
import { ProjectEntity } from '../project/ProjectEntity';
import { UserCryptoKeyEntity } from './UserCryptoKeyEntity';
import { UserPreferencesEntity } from './UserPreferencesEntity';

@Entity({ name: 'user' })
export class UserEntity implements User, INotifable {
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

    @Column()
    @Index({ unique: true })
    @IsString()
    public login: string;

    @Column({ type: 'varchar' })
    @IsEnum(LoginResource)
    public resource: LoginResource;

    @Column({ type: 'varchar' })
    @IsEnum(UserType)
    public type: UserType;

    @Column({ type: 'varchar' })
    @IsEnum(UserStatus)
    public status: UserStatus;

    @Column({ name: 'ledger_uid', nullable: true })
    @Index({ unique: true })
    @IsOptional()
    @Matches(LedgerUser.UID_REGXP)
    public ledgerUid?: string;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    /*
    @Transform(params => (params.value ? params.value.map(item => item.toObject()) : null), { toPlainOnly: true })
    @OneToMany(() => UserRoleEntity, item => item.user)
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    public roles?: Array<UserRoleEntity>;
    */

    @Transform(params => (params.value ? params.value.toObject() : null), { toPlainOnly: true })
    @OneToOne(
        () => UserPreferencesEntity,
        preferences => preferences.user,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    public preferences: UserPreferencesEntity;

    @Exclude()
    @OneToOne(
        () => UserCryptoKeyEntity,
        preferences => preferences.user,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    public cryptoKey: UserCryptoKeyEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, company => company.users, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    public company?: CompanyEntity;

    @Exclude()
    @Column({ name: 'company_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public companyId?: string;

    @Exclude()
    @OneToMany(() => ProjectEntity, item => item.user)
    public projects?: Array<ProjectEntity>;

    @Exclude()
    @OneToMany(() => PaymentEntity, item => item.user)
    public payments?: Array<PaymentEntity>;

    @Exclude()
    @OneToMany(() => UserRoleEntity, item => item.user)
    public userRoles?: Array<UserRoleEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toString(): string {
        return `${this.login}(${this.notifableUid})`;
    }

    public toObject(): User {
        return TransformUtil.fromClass<User>(this, { excludePrefixes: ['__'] });
    }

    public toCompanyObject(): CompanyUser {
        let item = { ...this.toObject(), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
    }

    public toProjectObject(): ProjectUser {
        let item = { ...this.toObject(), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
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
}
