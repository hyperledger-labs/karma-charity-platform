import { LedgerProject } from '@project/common/ledger/project';
import { Project, ProjectStatus } from '@project/common/platform/project';
import { TransformUtil } from '@ts-core/common/util';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ValidateNested, Matches, IsDefined, IsEnum, IsNumber, IsOptional } from 'class-validator';
import * as _ from 'lodash';
import { Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserProject } from '@project/common/platform/user';
import { UserEntity, UserRoleEntity } from '../user';
import { ProjectPreferencesEntity } from './ProjectPreferencesEntity';
import { CompanyEntity } from '../company';
import { PaymentEntity } from '../payment';

@Entity({ name: 'project' })
export class ProjectEntity implements Project {
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

    @Transform(params => (params.value ? params.value.toObject() : null), { toPlainOnly: true })
    @OneToOne(
        () => ProjectPreferencesEntity,
        preferences => preferences.project,
        { cascade: true, eager: true }
    )
    @IsDefined()
    @ValidateNested()
    public preferences: ProjectPreferencesEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, company => company.projects)
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    public company: CompanyEntity;

    @Exclude()
    @ManyToOne(() => UserEntity, user => user.projects)
    @ValidateNested()
    @JoinColumn({ name: "user_id" })
    public user: UserEntity;

    @Column({ name: "user_id" })
    @IsNumber()
    public userId: number;

    @Column({ name: "company_id" })
    @IsNumber()
    public companyId: number;

    @Exclude()
    public userRoles?: Array<UserRoleEntity>;

    @Exclude()
    @OneToMany(() => PaymentEntity, item => item.project)
    public payments?: Array<PaymentEntity>;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public toObject(): Project {
        return TransformUtil.fromClass<Project>(this, { excludePrefixes: ['__'] });
    }

    public toUserObject(): UserProject {
        let item = { ...this.toObject(), roles: [] };
        if (!_.isEmpty(this.userRoles)) {
            item.roles = this.userRoles.map(item => item.name);
        }
        return item;
    }

}
