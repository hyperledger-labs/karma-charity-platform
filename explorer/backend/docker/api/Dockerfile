FROM node:14 as build
# Set directory
WORKDIR /build
# Install dependencies and building
COPY . .
RUN npm i

# ----------------------------------- Patching corrupted fabric-shim -----------#
RUN cp /build/patch/index.d.ts /build/node_modules/fabric-shim/types/index.d.ts
# ------------------------------------------------------------------------------#

RUN cd /build/src/packages/application/api && npm i && npm run build

FROM node:14
# Set directory
WORKDIR /application
# Copy global node_modules
COPY --from=build /build/node_modules /application/node_modules
# Copy local node_modules
COPY --from=build /build/src/packages/application/api/node_modules /application/build/node_modules
# Copy compiled node_modules
COPY --from=build /build/src/packages/application/api/build/node_modules /application/build/node_modules
# Copy compiled files to working directory
COPY --from=build /build/src/packages/application/api/build/src/packages/application/api /application/build
# Set directory
WORKDIR /application/build
# Run command
CMD node main.js
