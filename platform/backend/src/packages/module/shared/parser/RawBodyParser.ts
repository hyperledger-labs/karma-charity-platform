import * as bodyParser from 'body-parser';

export function rawBodyParser() {
    const rawBodyBuffer = (request, response, buffer, encoding) => {
        if (buffer && buffer.length) {
            request.rawBody = buffer.toString(encoding || 'utf8');
        }
    };
    return bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true });
}