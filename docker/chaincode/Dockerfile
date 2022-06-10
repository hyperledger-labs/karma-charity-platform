FROM node:14 as build
# Set directory
WORKDIR /build
# Copy the source code
COPY ./chaincode .
COPY ./common ./src/packages/common
# Install dependencies and building
RUN npm i
# ----------------------------------- Patching corrupted fabric-shim -----------#
# Copy a patch for fabric-shim
COPY ./patch/index.d.ts ./node_modules/fabric-shim/types/index.d.ts
# ------------------------------------------------------------------------------#
RUN cd ./src/packages/application/chaincode && npm i && npm run build

FROM node:14
# Set directory
WORKDIR /application
# Copy global node_modules
COPY --from=build /build/node_modules /application/node_modules
# Copy local node_modules
COPY --from=build /build/src/packages/application/chaincode/node_modules /application/build/node_modules
# Copy compiled node_modules
COPY --from=build /build/src/packages/application/chaincode/build/node_modules /application/build/node_modules
# Copy compiled files to working directory
COPY --from=build /build/src/packages/application/chaincode/build/src/packages/application/chaincode /application/build
# Set directory
WORKDIR /application/build
# Run command
CMD node main.js
