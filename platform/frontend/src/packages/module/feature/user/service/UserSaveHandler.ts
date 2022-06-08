import { Injectable } from '@angular/core';
import { Logger } from '@ts-core/common/logger';
import { Transport, TransportCommandAsyncHandler } from '@ts-core/common/transport';
import * as _ from 'lodash';
import { Client } from '@common/platform/api';
import { IUserEditDto, IUserEditDtoResponse } from '@common/platform/api/user';
import { UserService } from '../../../core/service';
import { UserSaveCommand } from '../transport';
import { ExtendedError } from '@ts-core/common/error';

@Injectable({ providedIn: 'root' })
export class UserSaveHandler extends TransportCommandAsyncHandler<IUserEditDto, IUserEditDtoResponse, UserSaveCommand> {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(transport: Transport, logger: Logger, private user: UserService, private api: Client) {
        super(logger, transport, UserSaveCommand.NAME);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected async execute(params: IUserEditDto): Promise<IUserEditDtoResponse> {
        if (_.isNil(params.id) && this.user.isLogined) {
            params.id = this.user.user.id;
        }
        if (_.isNil(params.id)) {
            throw new ExtendedError('Unable to save user: uid is nil');
        }

        let item = await this.api.userEdit(params);
        if (this.user.isUser(item)) {
            this.user.userUpdate(item);
        }
        return item;
    }
}
