## Description

Currency Exchange API built with [Nest](https://github.com/nestjs/nest) framework.

## Features

- **User Authentication**: Secure user authentication using JWT.
- **Currency Exchange**: Exchange PLN to other currencies and vice versa.
- **Wallet Management**: Manage user wallets for different currencies.
- **Swap History**: Track and retrieve swap transactions for users.
- **Exchange Rate Fetching**: Fetch exchange rates from external APIs.
- **Health Check**: Check the health status of the application.

## Docker
```bash
# build and run the project using Docker
$ docker-compose up --build
```

## API Documentation
API documentation is available at `/swagger` endpoint when the application is running.


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Migrations

```bash
# generate a new migration
$ npm run migration:generate

# run migrations
$ npm run migration:run

# revert migrations
$ npm run migration:revert
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
