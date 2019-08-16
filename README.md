# Typescript-Node-Starter
Simple starter Node.js Application with Typescript

# Pre-requisite
1. You need to have [Node.js](https://nodejs.org/en/) installed.

3. Install [MongoDB](https://docs.mongodb.com/manual/installation/)

4. Install [Postman](https://www.getpostman.com/apps)

# Running the application locally
1. Clone this repository

    `git clone https://github.com/OpesanyaAdebayo/Basic-CRUD-Node-API.git`

2. Install dependencies

    `cd Basic-CRUD-Node-API`

    `npm install`

3. Create a `.env` file with the same variables as `.env.example` in this repository. Replace the contents with your own variables.

    Please note that `MONGODB_URI` is the connection url for MongoDB. I used MongoDB Atlas to manage my MongoDB instance but you can simply replace it with the url you use for your local MongoDB instance.

4. Start your MongoDB server

    `mongod`

5. Build the application

    `npm run build`

6. Start the application

    `npm start`

7. Visit `localhost:${PORT}` and the API should be ready.