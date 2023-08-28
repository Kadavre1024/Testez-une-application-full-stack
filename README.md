# Yoga

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project

### Front-End

Go inside folder:

> cd front

Install dependencies:

> npm install

Launch Front-end:

> npm run start;

### Back-End

> java -jar yoga-app-0.0.1-SNAPSHOT.jar

## Ressources

### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234

## Test

### Front-End

#### E2E

Launching e2e test:

> npm run e2e

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

#### Unit & Integration

Launching test:

> npm run test

for following change:

> npm run test:watch

Launching Integration tests only:

> npm run integration

Generate coverage report (you should launch test before):

> npm run test:coverage

Report is available here:

> front/coverage/jest/lcov-report/index.html

### Back-End

#### Unit tests

Launching test:

> mvn clean test

#### Integration tests

Lauching test:

> mvn verify

#### Coverage report

All reports are generated and updated after the `> mvn verify` command prompt. But they can also be generated (after launching tests) by :

> mvn jacoco:report

Report is available here:

> back/target/site/jacoco-unit-test-coverage-report/index.html : for unit tests report

> back/target/site/jacoco-integration-test-coverage-report/index.html : for integration tests report

> back/target/site/jacoco-unit-test-coverage-report/index.html : for unit tests report

> back/target/site/jacoco-merged-test-coverage-report/index.html : for th merged report of all tests


