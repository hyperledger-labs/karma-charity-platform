FROM node:14 as build
WORKDIR /build
# Install dependencies and building
COPY . .
RUN npm ci --only-production
RUN npm run build

FROM node:14
WORKDIR /application
COPY --from=build /build/build /application
COPY --from=build /build/node_modules /application/node_modules

ENV SOURCE=platform-admin
CMD node server.js