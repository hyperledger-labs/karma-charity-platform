import {
    UserRoleName,
    UserRole
} from '@project/common/platform/user';
import { ObjectUtil, TransformUtil } from '@ts-core/common/util';
import { Exclude } from 'class-transformer';
import { IsString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { CompanyEntity } from '../company';
import { UserEntity } from './UserEntity';
import { ProjectEntity } from '../project';

@Entity({ name: 'user_role' })
export class UserRoleEntity implements UserRole {
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
    public name: UserRoleName;

    @Column({ name: 'user_id' })
    @IsNumber()
    public userId: number;

    @Column({ name: 'company_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public companyId?: number;

    @Column({ name: 'project_id', nullable: true })
    @IsOptional()
    @IsNumber()
    public projectId?: number;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @UpdateDateColumn({ name: 'updated_date' })
    public updatedDate: Date;

    @Exclude()
    @ManyToOne(() => UserEntity, user => user.userRoles, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "user_id" })
    public user?: UserEntity;

    @Exclude()
    @ManyToOne(() => CompanyEntity, company => company.userRoles, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    public company?: CompanyEntity;

    @Exclude()
    @ManyToOne(() => ProjectEntity, project => project.userRoles, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "project_id" })
    public project?: ProjectEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    constructor(userId?: number, name?: UserRoleName, companyId?: number, projectId?: number) {
        if (!_.isNil(name)) {
            this.name = name;
        }
        if (!_.isNil(userId)) {
            this.userId = userId;
        }
        if (!_.isNil(companyId)) {
            this.companyId = companyId;
        }
        if (!_.isNil(projectId)) {
            this.projectId = projectId;
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public update(data: Partial<UserRole>): void {
        ObjectUtil.copyProperties(data, this);
    }

    public toObject(): UserRole {
        return TransformUtil.fromClass<UserRole>(this, { excludePrefixes: ['__'] });
    }
}
