# EventSourcing.JS

## Resources

## Configuration

1. Install NodeJS - https://nodejs.org/en/download/. Recommended NVM.
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
    - install:
    ```bash
    npm i -D typescript @types/express @types/node
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
            "es2021": true,
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
            "es2021": true,
            "node": true
        },
        "extends": [
            "plugin:@typescript-eslint/recommended",
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
        "lint": "npm run lint:eslint && npm run lint:prettier",
        "lint:prettier": "prettier --check \"src/**/**/!(*.d).{ts,json,md}\"",
        "lint:eslint": "eslint src/**/*.ts",
    }
    ```
    - fixes:
    ```json
    { 
        "lint:eslint": "eslint src/**/*.ts",
        "prettier:fix": "prettier --write \"src/**/**/!(*.d).{ts,json,md}\"",
    }
    ```
8. [Husky](https://github.com/typicode/husky#readme) is a tool that enables to run scripts on precommit git hook. We'll use it to run `ESLint` and `Prettier` to make sure that code is formatted and following rules.
   - install version 4 (Starting for version 5 it's free only for OSS projects):
   ```bash
   npm i -D husky@4
   ```
   - add Husky configuration to [package.json](./samples/simple/package.json)
   ```json
   {
        "husky": {
            "hooks": {
                "pre-commit": "npm run lint"
            }
        }
   }
   ```
9.  Install nodemon (to have hot reload of changes):