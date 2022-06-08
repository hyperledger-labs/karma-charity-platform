//--------------------------------------------------------------------------
//
// 	Imports
//
//--------------------------------------------------------------------------

import { UserModule } from '../feature/user';
import { LoginModule } from '../feature/login';
import { CompanyModule } from '../feature/company';
import { ProfileModule } from '../feature/profile';
import { ProfileQuizModule } from '../feature/profile-quiz';
import { PaymentModule } from '../feature/payment';
import { ProjectModule } from '../feature/project';
import { FileModule } from '../feature/file';
import { ImageCropModule } from '../feature/image-crop';

export const TRANSPORT_LAZY_MODULES = [
    {
        id: LoginModule.ID,
        commands: LoginModule.COMMANDS,
        path: async () => (await import('../feature/login')).LoginModule
    },
    {
        id: UserModule.ID,
        commands: UserModule.COMMANDS,
        path: async () => (await import('../feature/user')).UserModule
    },
    {
        id: CompanyModule.ID,
        commands: CompanyModule.COMMANDS,
        path: async () => (await import('../feature/company')).CompanyModule
    },
    {
        id: PaymentModule.ID,
        commands: PaymentModule.COMMANDS,
        path: async () => (await import('../feature/payment')).PaymentModule
    },
    {
        id: ProfileModule.ID,
        commands: ProfileModule.COMMANDS,
        path: async () => (await import('../feature/profile')).ProfileModule
    },
    {
        id: FileModule.ID,
        commands: FileModule.COMMANDS,
        path: async () => (await import('../feature/file')).FileModule
    },
    {
        id: ImageCropModule.ID,
        commands: ImageCropModule.COMMANDS,
        path: async () => (await import('../feature/image-crop')).ImageCropModule
    },
    {
        id: ProjectModule.ID,
        commands: ProjectModule.COMMANDS,
        path: async () => (await import('../feature/project')).ProjectModule
    },
    {
        id: ProfileQuizModule.ID,
        commands: ProfileQuizModule.COMMANDS,
        path: async () => (await import('../feature/profile-quiz')).ProfileQuizModule
    }
];
