# HOUSE OF GAMES API

Welcome to my very own House of Games API, created as part of the Northcoders back-end portfolio project! This RESTful API has a variety of functionalities, including the ability to retrieve data, add new data, and modify or delete existing data from the board games database.

This API is also hosted [**online**](https://tuxedo-frog.cyclic.app/api) using [ElephantSQL](https://www.elephantsql.com/) and [Cyclic](https://www.cyclic.sh/)

# REQUIREMENTS

| **Tool**   | **Required Version** |
| ---------- | -------------------- |
| Node.js    | V19.0.0 or later     |
| PostgreSQL | V14.5 or later       |

# SETUP

## Cloning

To be able to use this repository locally on your machine, you'll first need to clone it. Click the green <span style="color:lime;font-weight:bold"><> Code</span> button near the top of the page, then copy this repository's .git link, as shown below:

<img src="https://i.imgur.com/jouVsfb.png" alt="How to clone" width="250" height="250">

Once you've copied the .git url, head to your terminal and clone into the directory of your choice using the command:

```
git clone <LINK HERE>
```

## Installing dependencies

Once you've successfully cloned the repo and are inside your chosen IDE, there's a couple of extra steps needed, and the first is to install all of the dependencies required for the project to function. Use the following command to install everything you'll need:

```
npm install
```

## Environment Variables

Next, you'll need to set your environment variables. Create two files in the root directory, named `.env.development` and `.env.test` respectively.

Populate `.env.development` with:

```
PGDATABASE=nc_games
```

Populate `.env.test` with:

```
PGDATABASE=nc_games_test
```

## Initialising database

Before we can do anything else, we'll need to initialise our databases. Run the following command:

```
npm run setup-dbs
```

This will create the database and nothing else, as we'll be populating the database via seeding. Speaking of which...

## Seeding

To seed the data for a **development** context, use the command:

```
npm run seed
```

This will seed the database with the full set of data, which is what will be used when the project is deployed.

When working on the database, it's better for us to use a smaller set of data for testing purposes, which is fine as long as all of the data keeps the same format. Our test suite, Jest, will automatically seed the database with our **test** data, before each test is ran:

```js
// index.test.js

const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data)); // we are seeding the database with the test data that has been required in, before each test is ran
afterAll(() => db.end());
```

## Testing

This project makes use of the npm package `SuperTest` in collaboration with our chosen testing suite, Jest. To run the tests:

```
npm t index.test.js
```

For creating further tests, take a look at the SuperTest [documentation](https://npmjs.com/package/supertest)
