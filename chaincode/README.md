# Karma chaincode

This folder contains the source code of the Karma chaincode.

## Using as a regular chaincode

It is recommended to build the chaincode before deploying it in the Hyperledger Fabric network. To build the chaincode 
you need `npm` (version >= 12) installed on your machine.

First, run this in the root folder of the chaincode:

```shell
npm install
```
Then, in a folder `src/packages/application/chaincode` run the following commands:
```shell
npm i && npm run build
```

The result of the build will be available in a folder `src/packages/application/chaincode/build`.

Next, create the chaincode package and install it onto the Hyperledger Fabric peers.

## Using as an external chaincode

Use this [docker file](docker/chaincode/Dockerfile) to build the chaincode image. 

```shell
docker build -f docker/chaincode/Dockerfile -t karma-chaincode .
```

Please see [this topic](https://hyperledger-fabric.readthedocs.io/en/release-2.2/cc_launcher.html) for details of using
a chaincode as an external service.
