![Twitter Follow](https://img.shields.io/twitter/follow/oskar_at_net?style=social) [![Github Sponsors](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&link=https://github.com/sponsors/oskardudycz/)](https://github.com/sponsors/oskardudycz/) [![blog](https://img.shields.io/badge/blog-event--driven.io-brightgreen)](https://event-driven.io/)

# EventSourcing.JS

- [EventSourcing.JS](#eventsourcingjs)
  - [Samples](#samples)
  - [Node.js project configuration](#nodejs-project-configuration)
    - [General configuration](#general-configuration)
    - [VSCode debug configuration](#vscode-debug-configuration)
    - [Unit tests with Jest](#unit-tests-with-jest)
    - [CI - Run tests with Github Actions](#ci---run-tests-with-github-actions)
  - [Tasks List](#tasks-list)

## Samples

1. Simple Event Sourcing sample: [samples/simple](./samples/simple).
## Node.js project configuration

### General configuration

1. Install Node.js - https://Node.js.org/en/download/. Recommended NVM.
2. Create project:
    ```bash
    npm init -y
    ```
3. [ExpressJS](https://expressjs.com/) - Web Server for REST API.
    - install:
    ```bash
    npm i express
    ```
4. [TypeScript](typescriptlang.org/) - We'll be doing Type Driven Development
    - install together with types for `Node.js` and `Express` and [TS Node](https://github.com/TypeStrong/ts-node)
    ```bash
    npm i -D typescript @types/express @types/node ts-node
    ```
    - you can also install TypeScript compiler globally by running:
    ```bash
    npm i -g typescript
    ```
    - add TypeScript compiler buid command to NPM:
    ```json
    { 
        "scripts": {
            "build:ts": "tsc",
        }
    }
    ```
    - if you installed `tsc` globally you can init TypeScript config by running:
    ```bash
    tsc --init
    ```
    - or you can just create the [tsconfig.json](./samples/simple/tsconfig.json) file, e.g.:
    ```json
    {
        "compilerOptions": {
            "target": "es2020", 
            "module": "commonjs",
            "outDir": "./dist",
            "strict": true, 
            "strictNullChecks": true,
            "noUnusedLocals": true,
            "noImplicitReturns": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "forceConsistentCasingInFileNames": true,
        },
        "include": ["./src"],
    }
    ```
5. [ESLint](https://eslint.org) - We'd like to have static code analysis:
    - install using [npx](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner) and going through wizard. This will generate install all packages and generate needed files (suggested is to use ECMA Modules, TypeScript, )
    ```bash
    npx eslint --init

    √ How would you like to use ESLint? · style       
    √ What type of modules does your project use? · esm
    √ Which framework does your project use? · none
    √ Does your project use TypeScript? · No / Yes
    √ Where does your code run? · node
    √ How would you like to define a style for your project? · guide
    √ Which style guide do you want to follow? · standard    
    √ What format do you want your config file to be in? · JSON
    ```
    - or using the `npm`:
    ```bash
    npm i -D @typescript-eslint/eslint-plugin eslint-config-standard eslint eslint-plugin-import eslint-plugin-node eslint-plugin-promise @typescript-eslint/parser
    ```
    - this should generate [.eslintrc.json](./samples/simple/.eslintrc.json) file with ESLint configuration:
    ```json
    {
        "env": {
            "es2020": true,
            "node": true
        },
        "extends": [
            "standard"
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "ecmaVersion": 12,
            "sourceType": "module"
        },
        "plugins": [
            "@typescript-eslint"
        ],
        "rules": {
        }
    }
    ```
    - add [.eslintignore](./samples/simple/.eslintignore) to configure exclusion for files that we don't want to analyse:
    ```bash
    /node_modules/*
    
    # build artifacts
    dist/*coverage/*

    # data definition files
    **/*.d.ts

    # custom definition files
    /src/types/
    ```

6. [Prettier](https://prettier.io), as we aim to write pretty code:
    - install:
    ```bash
    npm i -D prettier eslint-config-prettier eslint-plugin-prettier
    ```
    - add [.prettierrc.json](./samples/simple/.prettierrc.json) with Prettier config:
    ```json
    {
        "tabWidth": 2,
        "singleQuote": true
    }
    ```
    - add Prettier plugin to [.eslintrc.json](./samples/simple/.eslintrc.json) to make sure that then collide with each other:
    ```json
    {
        "env": {
            "es2020": true,
            "node": true
        },
        "extends": [
            "plugin:@typescript-eslint/recommended", <-- updated
            "prettier/@typescript-eslint", <-- added
            "plugin:prettier/recommended" <-- added
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "ecmaVersion": 12,
            "sourceType": "module"
        },
        "plugins": [
            "@typescript-eslint"
        ],
        "rules": {
        }
    }
    ``` 
    - if you're using VSCode, I recommend to install [Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
7. Define tasks for ESLint and Prettier in [package.json](./samples/simple/package.json):
    - checks:
    ```json
    {
        "scripts": {
            "lint": "npm run lint:eslint && npm run lint:prettier",
            "lint:prettier": "prettier --check \"src/**/**/!(*.d).{ts,json,md}\"",
            "lint:eslint": "eslint src/**/*.ts",
        }
    }
    ```
    - fixes:
    ```json
    { 
        "scripts": {
            "lint:eslint": "eslint src/**/*.ts",
            "prettier:fix": "prettier --write \"src/**/**/!(*.d).{ts,json,md}\"",
        }
    }
    ```
8. [Husky](https://github.com/typicode/husky#readme) is a tool that enables to run scripts on precommit git hook. We'll use it to run `ESLint` and `Prettier` to make sure that code is formatted and following rules.
   - install version 4 (Starting for version 5 it's free only for OSS projects):
   ```bash
   npm i -D husky@4
   ```
   - add Husky configuration to [package.json](./samples/simple/package.json):
   ```json
   {
        "husky": {
            "hooks": {
                "pre-commit": "npm run lint"
            }
        }
   }
   ```
9. [Nodemon](https://nodemon.io/) to have hot-reload of the running Express server code.
    - install:
    ```bash
    npm i -D nodemon
    ```
    - add script to [package.json](./samples/simple/package.json) to run Express server with Nodemon:
     ```json
    {
        "scripts": {
            "dev:start": "nodemon src/index.ts",
        }
    }
    ```
    - you can run dev script as:
    ```bash
    npm run dev:start
    ```
    - open in browser http://localhost:5000/ and check if you see result:
    ```json
    { "greeting": "Hello World!" }
    ```
### VSCode debug configuration

To configure VSCode debug you need to add [launch.json](./samples/simple/.vscode/launch.json) file in the [.vscode](./samples/simple/.vscode) folder.

To not need to synchronise two separate configurations, we'll reuse the existing NPM script `dev:start` that starts the application. 

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run-script", "dev:start", "--", "--inspect-brk=9229"],
      "port": 9229
    }
  ]
}
```

As we have TypeScript configured, then we don't need any additional setup. We're reusing the native node debugging capabilities by using the `--inspect-brk=9229` parameter. Read more in the [Node.js documentation](https://Node.js.org/en/docs/guides/debugging-getting-started/)

### Unit tests with Jest

1. Install [Jest]() together with [ts-jest]() package and needed typings to make it work with TypeScript.
```bash
npm i -D jest @types/jest ts-jest
```
2. Configure Jest with using npx installer:
```bash
npx ts-jest config:init
```
3. This will create [jest.config.js](./samples/simple/jest.config.js) with Jest needed configuration:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```
4. Let's add some dummy code to make sure that our tests are working. This can be e.g. `src/greetings/getGreeting.ts`
```typescript
export function getGreeting() {
  return {
    greeting: 'Hello World!',
  };
}
```
5. Let's add also some dummy unit test running this code. I'll put it in the same directory, as in my opinion it makes easier development and focus on the specific test instead of jumping from one place to another. In this case it will be `src/greetings/getGreetings.unit.test.ts`
```typescript
import { getGreeting } from './getGreeting';

describe('getGreeting', () => {
  it('should return greeting "Hello World!"', () => {
    const result = getGreeting();

    expect(result).toBeDefined();
    expect(result.greeting).toBe('Hello World!');
  });
});
```
6. To run Jest we need to add new NPM script to [package.json](./samples/simple/package.json):
```json
{
    "scripts": {        
        "test:unit": "jest unit",
    }
}
```
Now you can run them with:
```bash
npm run test:unit
```
Jest will be smart enough to find by convention all files with `.unit.test.ts` suffix.
7. To be able to debug our tests we have to add new debug configurations to [launch.json](./samples/simple/.vscode/launch.json). We'll be using `watch` settings, so we don't have re-run tests when we updated logic or test code. 
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Jest all tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
      "args": ["--verbose", "-i", "--no-cache", "--watchAll"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Jest current test",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      "args": [
        "${fileBasename}",
        "--verbose",
        "-i",
        "--no-cache",
        "--watchAll"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### CI - Run tests with Github Actions

It's important to have your changes be verified during the pull request process. We'll use GitHuba Actions as the sample of how to do that. You need to create the [.github/workflows](./.github/workflows) folder and putt there new file (e.g. [samples_simple.yml](./.github/workflows/samples_simple.yml)). This file will contain YAML configuration for your action:

The simplest setup will look like:

```yaml
name: Node.js CI

on:
  # run it on push to the default repository branch
  push:
    branches: [$default-branch]
  # run it during pull request
  pull_request:

defaults:
  run:
    # relative path to the place where source code (with package.json) is located
    working-directory: samples/simple

jobs:
  build:
    # use system defined below in the tests matrix
    runs-on: windows-latest

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 14.x
        uses: actions/setup-node@v1
        with:
          # use the node version defined in matrix above
          node-version: 14.x
      # install dependencies based on the package log
      - run: npm ci
      # run linting (ESlint and Prettier)
      - run: npm run lint
      # run build
      - run: npm run build:ts
      # run tests
      - run: npm run test:unit
```

If you want to make sure that your code will be running properly for a few Node.js versions and different opeating systems (e.g. because developers may have different environment configuration) then you can use matrix tests:

```yaml
name: Node.js CI

on:
  # run it on push to the default repository branch
  push:
    branches: [$default-branch]
  # run it during pull request
  pull_request:

defaults:
  run:
    # relative path to the place where source code (with package.json) is located
    working-directory: samples/simple

jobs:
  build:
    # use system defined below in the tests matrix
    runs-on: ${{ matrix.os }}

    strategy:
      # define the test matrix
      matrix:
        # selected operation systems to run CI
        os: [windows-latest, ubuntu-latest, macos-latest]
        # selected node version to run CI
        node-version: [14.x, 15.x]

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          # use the node version defined in matrix above
          node-version: ${{ matrix.node-version }}
      # install dependencies
      - run: npm ci
      # run linting (ESlint and Prettier)
      - run: npm run lint
      # run build
      - run: npm run build:ts
      # run tests
      - run: npm run test:unit
```

## Tasks List

- [ ] Configuration
  - [x] Initial ExpressJS boilerplate configuration [PR](https://github.com/oskardudycz/EventSourcing.JS/pull/1)
  - [x] Add VSCode debugging configuration [PR](https://github.com/oskardudycz/EventSourcing.JS/pull/2)
  - [x] Add Jest unit test configuration with VSCode debug settings [PR](https://github.com/oskardudycz/EventSourcing.JS/pull/3)
  - [x] CI - Run tests with Github Actions
  - [ ] Add Jest api tests with SuperTest
- [ ] Start Live Coding on Twitch
- [ ] Add EventStoreDB gRPC client samples with basic streams operations
- [ ] Add samples for Aggregates
- [ ] Add samples for Subscriptions and projections to SQL lite
- [ ] Create project template like `Create React App` for creating `EventStoreDB Node.js App`
