import { PassportModule } from '@nestjs/passport';
import { TransportModule } from '@ts-core/backend-nestjs';
import { DatabaseModule } from '@project/module/database';
import { JwtModule } from '@nestjs/jwt';
import { LoginService, UserService } from './service';
import { DynamicModule } from '@nestjs/common';
import { GoogleSiteStrategy, IVkSiteStrategySettings, PasswordStrategy, VkSiteStrategy } from './strategy';
import { JwtStrategy } from './strategy/JwtStrategy';
import { IGoogleSiteStrategySettings, IJwtStrategySettings } from './strategy';
import { LoginController } from './controller/LoginController';
import { InitController } from './controller/InitController';
import { GuardModule } from '@project/module/guard';
import { LogoutController } from './controller/LogoutController';
import { SharedModule } from '@project/module/shared';
import { RegisterController } from './controller/RegisterController';
import { PasswordChangeController } from './controller/PasswordChangeController';
import { DeactivateController } from './controller/DeactivateController';

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
                    provide: GoogleSiteStrategy,
                    inject: [UserService],
                    useFactory: (user: UserService) => new GoogleSiteStrategy(settings, user)
                },
                {
                    provide: VkSiteStrategy,
                    inject: [UserService],
                    useFactory: (user: UserService) => new VkSiteStrategy(settings, user)
                },
                PasswordStrategy,

                LoginService,
                UserService
            ],
            controllers: [LoginController, DeactivateController, PasswordChangeController, LogoutController, RegisterController, InitController]
        };
    }
}

export type ILoginSettings = IGoogleSiteStrategySettings & IVkSiteStrategySettings & IJwtStrategySettings;
