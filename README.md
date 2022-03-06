# Kingfisher. A card game - note taking API.

A REST API created using [Node](https://nodejs.org/en/) and [express.js](https://expressjs.com/). Using [PSQL](https://www.postgresql.org/) for data persistance and jsonwebtokens and [bcrypt](https://bcrypt.online/) to handle user authorisation. Uses Socket.io to give connected clients instant feedback.

Uses websockets with Socket.io to give instant updates and feedback across multiple clients and gives real time feedback in the admin panel of users actions.

## Description

A note taking API for card games that allows a user to create players and relate various points of information to those players.

Contains protected routes that allows only validated and registered users to access and amend saved data.

Once a user is registered, they can either automatically be given access or be required to contact an administrator for manual validation.

Permissions can be revoked at any time by someone flagged as administrator.

A user who is flagged as administrator can amend information about signed up users through the [Aministrator dashboard](https://github.com/CtrlHoltDel/kf-admin-dashboard).

## Setup

_note_ Whenever running commands, always run whilst in the projects root folder.

### Minimum required versions

Node - `v16.13.0`

PSQL version - `12.9`

### Local Setup

- Clone this repository and install the dependencies (installed by typing `npm install` in the terminal whilst in the root folder).

- Create two files in the root folder, one named `.env.development` and one named `.env.test`.

Within them copy and paste the following (replacing the `DATABASE_NAME` with what you wish the local databases to be called and the `SECRET` with any random characters, used to generate unique web tokens)

```
PGDATABASE=DATABASE_NAME
JWT_SECRET=SECRET
```

- Type `npm run cdb`. This will create the two databases - one for testing and another for holding data locally.

- **_Optional_** Run the command `npm t` to run the suite of tests (found in `/__tests__`)

- Run the command `npm run seed` to fill the databases with some test data (found in `/db/data/initial-data.json`.

  _Note_ The database with be instantiated with a user named `admin` with the password `admin`. This account can be removed once a new account has been registered and designated administrator.

- Finally run the command `npm run start`.

This will run a version the API locally at http://localhost:4000. This can be altered by changing the `PORT` variable in `/listen.js`

Visit the `/` endpoint for more specific information about the APIs functionality.

Initially you will only be able to access the `/` endpoint. Sending a post request to the `/auth/login` endpoint with the admin credentials will give you a web token allowing access to the rest of the API.

# Tech used

| General                              | Description                                              |
| ------------------------------------ | -------------------------------------------------------- |
| [Node](https://nodejs.org/en/)       | Non-browser Javascript runtime the server is built upon. |
| [express.js](https://expressjs.com/) | HTTP web application framework.                          |
| [Socket.io](https://socket.io/)      | Bidirectional realtime communication library             |

| Database                                                  | Description                                         |
| --------------------------------------------------------- | --------------------------------------------------- |
| [PSQL](https://www.postgresql.org/docs/9.2/app-psql.html) | Relational Database. Used to store persistant data. |

| Authorisation                                              | Description                                                                                               |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | Used to create access tokens to validate and keep track of user authorisation.                            |
| [Passport](https://www.npmjs.com/package/passport)         | Middleware for express to aid in authenticating user requests with the use of strategies                  |
| [Bcrypt](https://bcrypt.online/)                           | A package which hashes and salts user passwords for storage. Also used to decrypt passwords during login. |

| Testing                                              | Description                                                |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| [Jest](https://jestjs.io/)                           | Javascript testing framework. Used throughout the project. |
| [Supertest](https://www.npmjs.com/package/supertest) | Used in conjunction with Jest. Used to test HTTP requests  |
