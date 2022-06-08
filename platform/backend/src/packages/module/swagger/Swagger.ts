import { Type, applyDecorators, HttpStatus, HttpCode } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiForbiddenResponse,
    ApiHeader,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
    ApiBearerAuth,
    ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import * as _ from 'lodash';

// --------------------------------------------------------------------------
//
//  Interface
//
// --------------------------------------------------------------------------

export interface ISwaggerDecorators {
    name: string;
    response: Type<any>;
    responseDescription?: string;
    isEnableUnprocessableEntity?: boolean;
    isDisableBearer?: boolean;
    isDisableBadRequest?: boolean;
    isDisableTooManyRequests?: boolean;
    code?: HttpStatus;
}

// --------------------------------------------------------------------------
//
//  Methods
//
// --------------------------------------------------------------------------

export function Swagger(swagger: ISwaggerDecorators): any {
    let items: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];
    items.push(ApiOperation({ summary: swagger.name }));
    items.push(HttpCode(swagger.code || HttpStatus.OK));

    if (!swagger.isDisableBearer) {
        items.push(ApiBearerAuth());
        items.push(ApiUnauthorizedResponse({ description: `Authorization failed` }));
        items.push(ApiForbiddenResponse({ description: 'Forbidden resource' }));
    }
    if (!_.isNil(swagger.response)) {
        items.push(ApiOkResponse({ type: swagger.response, description: swagger.responseDescription }));
    }
    if (!swagger.isDisableBadRequest) {
        items.push(ApiBadRequestResponse({ description: 'Bad request' }));
    }
    if (!swagger.isDisableTooManyRequests) {
        items.push(ApiTooManyRequestsResponse({ description: `Too many requests` }));
    }
    if (swagger.isEnableUnprocessableEntity) {
        items.push(ApiUnprocessableEntityResponse());
    }

    return applyDecorators(...items);
}
