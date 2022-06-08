import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawBody = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        let request = context.switchToHttp().getRequest();
        return request.rawBody || null;
    },
);