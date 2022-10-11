import {
    UserRoleName,
    UserRole
} from '@project/common/platform/user';
import { ValidateUtil } from '@ts-core/common';
import { Exclude } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { CreateDateColumn, BeforeUpdate, BeforeInsert, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';

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

    @BeforeUpdate()
    @BeforeInsert()
    public validate(): void {
        ValidateUtil.validate(this);
    }
}
