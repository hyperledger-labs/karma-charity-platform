# Karma HLF Explorer Backend

To build the Karma HLF Explorer Backend run the following command from the project's root directory:

```shell
docker build -f docker/explorer/backend/api/Dockerfile -t hlf-explorer-api .
```

The following command builds an image with database migrations

```shell
docker build -f docker/explorer/backend/api/Dockerfile-migrations -t hlf-explorer-migrations.
docker build -f docker/explorer/backend/database/Dockerfile -t hlf-explorer-migrations.
```

Please see an example how to run the image in the [docker-compose file](docker-compose.yml).

## Connecting the HLF network

The file [ledgers.json](../../docker/explorer/backend/api/data/ledgers.json) contains the sample of configuration.
The field `fabricConnectionSettings` is a [connection profile](https://hyperledger-fabric.readthedocs.io/en/release-2.2/developapps/connectionprofile.html)
for the Hyperledger Fabric SDK.
