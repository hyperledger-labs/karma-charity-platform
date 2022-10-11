import { IInitDtoResponse, ILoginDto, ILoginDtoResponse } from '@project/common/platform/api/login';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend';
import { Logger } from '@ts-core/common';
import { TraceUtil } from '@ts-core/common';
import { IsEnum, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { REGISTER_URL } from '@project/common/platform/api';
import { LoginResource } from '@project/common/platform/api/login';
import { LoginService } from '../service';
import { Swagger } from '@project/module/swagger';
import { IRegisterDto } from '@project/common/platform/api/login';
import { InitDtoResponse } from './InitController';
import { PasswordStrategy } from '../strategy';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class RegisterDto implements IRegisterDto {
    @ApiProperty()
    @IsString()
    public email: string;

    @ApiProperty()
    @IsString()
    public password: any;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(REGISTER_URL)
export class RegisterController extends DefaultController<IRegisterDto, ILoginDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private service: LoginService, private password: PasswordStrategy,) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Register user', response: InitDtoResponse, isDisableBearer: true })
    @Post()
    public async execute(@Body() params: RegisterDto): Promise<ILoginDtoResponse> {
        let item = await this.password.register(TraceUtil.addIfNeed(params));
        return this.service.sign(item);
    }
}
