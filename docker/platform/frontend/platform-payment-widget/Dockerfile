FROM node:16 as build
WORKDIR /build
# Copy the source code
COPY ./platform/frontend .
COPY ./common ./src/externals/common
# Install dependencies and building
RUN npm ci --only-production
RUN npm run platform-payment-widget:build

FROM node:16
WORKDIR /application
COPY --from=build /build/build /application
COPY --from=build /build/node_modules /application/node_modules

ENV SOURCE=platform-payment-widget
CMD node server.js
