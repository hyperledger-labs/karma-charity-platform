import { ILoginDto, ILoginDtoResponse } from '@project/common/platform/api/login';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DefaultController } from '@ts-core/backend/controller';
import { Logger } from '@ts-core/common/logger';
import { TraceUtil } from '@ts-core/common/trace';
import { IsEnum, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LOGIN_URL } from '@project/common/platform/api';
import { LoginResource } from '@project/common/platform/api/login';
import { LoginService } from '../service';
import { Swagger } from '@project/module/swagger';
import { IUserHolder } from '@project/module/database/user';

// --------------------------------------------------------------------------
//
//  Dto
//
// --------------------------------------------------------------------------

export class LoginDto implements ILoginDto {
    @ApiProperty()
    @IsEnum(LoginResource)
    public resource: LoginResource;

    @ApiProperty()
    @IsDefined()
    public data: any;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    traceId?: string;
}

export class LoginDtoResponse implements ILoginDtoResponse {
    @ApiProperty()
    @IsNotEmpty()
    public sid: string;

    @ApiProperty()
    @IsNotEmpty()
    public token: string;
}

// --------------------------------------------------------------------------
//
//  Controller
//
// --------------------------------------------------------------------------

@Controller(LOGIN_URL)
export class LoginController extends DefaultController<ILoginDto, ILoginDtoResponse> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(logger: Logger, private service: LoginService) {
        super(logger);
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    @Swagger({ name: 'Login user', response: LoginDtoResponse, isDisableBearer: true })
    @Post()
    public async execute(@Body() params: ILoginDto): Promise<ILoginDtoResponse> {
        return this.service.login(TraceUtil.addIfNeed(params));
    }
}
