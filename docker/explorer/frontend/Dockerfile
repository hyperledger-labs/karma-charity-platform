FROM node:14 as build
WORKDIR /build
COPY ./explorer/frontend .
RUN npm ci --only-production
RUN npm run explorer:build

FROM node:14
WORKDIR /application
COPY --from=build /build/build /application
COPY --from=build /build/node_modules /application/node_modules

ENV SOURCE=explorer
CMD node server.js
