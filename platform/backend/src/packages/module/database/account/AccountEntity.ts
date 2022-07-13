import { ValidateUtil } from '@ts-core/common/util';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsOptional, ValidateNested } from 'class-validator';
import { CreateDateColumn, JoinColumn, BeforeInsert, BeforeUpdate, ManyToOne, UpdateDateColumn, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as _ from 'lodash';
import { CompanyEntity } from '../company';
import { ProjectEntity } from '../project';
import { Account, AccountType } from '@project/common/platform/account';
import { LedgerCoinId } from '@project/common/ledger/coin';

@Entity({ name: 'account' })
export class AccountEntity implements Account {
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
    @IsEnum(AccountType)
    public type: AccountType;

    @Column({ type: 'varchar' })
    @IsString()
    public amount: string;

    @Column({ type: 'varchar', name: 'coin_id' })
    @IsEnum(LedgerCoinId)
    public coinId: LedgerCoinId;

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
    @ManyToOne(() => CompanyEntity, company => company.accounts, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "company_id" })
    @Type(() => CompanyEntity)
    public company?: CompanyEntity;

    @Exclude()
    @ManyToOne(() => ProjectEntity, project => project.accounts, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @JoinColumn({ name: "project_id" })
    @Type(() => ProjectEntity)
    public project?: ProjectEntity;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(type?: AccountType, coinId?: LedgerCoinId, companyId?: number, projectId?: number, amount?: string) {
        if (!_.isNil(type)) {
            this.type = type;
        }
        if (!_.isNil(amount)) {
            this.amount = amount;
        }
        if (!_.isNil(coinId)) {
            this.coinId = coinId;
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
