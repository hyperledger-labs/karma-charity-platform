import { PassportModule } from '@nestjs/passport';
import { Transport } from '@ts-core/common/transport';
import { TransportModule } from '@ts-core/backend-nestjs/transport';
import { DatabaseModule } from '@project/module/database';
import { JwtModule } from '@nestjs/jwt';
import { LoginService, UserService } from './service';
import { DynamicModule } from '@nestjs/common';
import { GoogleStrategy } from './strategy/GoogleStrategy';
import { JwtStrategy } from './strategy/JwtStrategy';
import { IGoogleStrategySettings, IJwtStrategySettings } from './strategy';
import { LoginController } from './controller/LoginController';
import { InitController } from './controller/InitController';
import { GuardModule } from '@project/module/guard';
import { LogoutController } from './controller/LogoutController';
import { SharedModule } from '@project/module/shared';

export class LoginModule {
    // --------------------------------------------------------------------------
    //
    //  Public Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(settings: ILoginSettings): DynamicModule {
        return {
            module: LoginModule,
            imports: [
                SharedModule,
                GuardModule,
                DatabaseModule,
                TransportModule,
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.register({ secret: settings.jwtSecret, signOptions: { expiresIn: settings.jwtExpiresTimeout } })
            ],
            providers: [
                {
                    provide: JwtStrategy,
                    inject: [UserService],
                    useFactory: (user: UserService) => new JwtStrategy(settings, user)
                },
                {
                    provide: GoogleStrategy,
                    inject: [UserService],
                    useFactory: (user: UserService) => new GoogleStrategy(settings, user)
                },
                LoginService,
                UserService
            ],
            controllers: [LoginController, LogoutController, InitController]
        };
    }
}

export type ILoginSettings = IGoogleStrategySettings & IJwtStrategySettings;
