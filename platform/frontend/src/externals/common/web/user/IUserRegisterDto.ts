import { IsString, IsOptional, IsEmail } from 'class-validator';

export interface IUserRegisterDto {
    name: string;
    lastname: string;
    middlename?: string;
    email: string;
    password: string;
}

export class UserRegisterDto implements IUserRegisterDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    lastname: string;

    @IsOptional()
    @IsString()
    middlename?: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
