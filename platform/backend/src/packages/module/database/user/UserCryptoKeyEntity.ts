import {
    UserPreferences
} from '@project/common/platform/user';
import { ObjectUtil, TransformUtil } from '@ts-core/common/util';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Matches, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';
import * as _ from 'lodash';
import { CryptoKey, CryptoKeyStatus } from '@project/common/platform/crypto';

@Entity({ name: 'user_crypto_key' })
export class UserCryptoKeyEntity implements CryptoKey {
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
    @IsEnum(CryptoKeyStatus)
    public status: CryptoKeyStatus;

    @Column()
    @IsString()
    public algorithm: string;

    @Column({ name: 'public_key' })
    @IsString()
    public publicKey: string;

    @Column({ name: 'private_key' })
    @IsString()
    public privateKey: string;

    @Exclude()
    @OneToOne(
        () => UserEntity,
        user => user.cryptoKey
    )
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public update(data: Partial<UserPreferences>): void {
        ObjectUtil.copyProperties(data, this);
    }

    public toObject(): UserPreferences {
        return TransformUtil.fromClass<UserPreferences>(this, { excludePrefixes: ['__'] });
    }

}
