![logo](https://res.cloudinary.com/dio0rdpui/image/upload/v1654209954/readme-image_wuwnmx.png)

# Backend for stylish mobile app


**Stylish REST API**, mounted on a `nodejs` and `expressjs` structure, with a `mongodb` database hosted on mongodb atlas.
Structure based on the <a href="https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller">MVC pattern</a>.

<br>

## About development

**First of all** you must install al node packages included in `package.json`, soo you must install first of all <a href="https://nodejs.org/es/download/">node</a>.

```bash
npm install
```

- Once the installations are finished, you must generate the **JWTSecret key** the following command.

- And then copy the key to the `.env` file on the `JWTSECRET` env variabe.

```bash
npm run secret:generate
```

- Then you need to generate the Google Oauth2 client id and secret. On Google developer console. And then copy the keys to the `.env` file on the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env variables.

- You need to create the mongo database and paste the connection to the `.env` file on the `MONGODB_URI` env variable.

<br>

When that's done, you can run the server with the following command.

```bash
npm run dev
```

<br>

## About production

Deployed on <a href="https://stylish-backend.herokuapp.com/">Heroku</a>.
Linked with github repository, and the same database as development area.\
For pushing in production use always the most secure branch of the proyect, like `master`.

How to install and mount `Heroku` into the repository: 
```bash
    npm i -g heroku
    heroku login
    heroku -v
    heroku git:remote -a stylish-backend
```

How to deploy:

```bash
git push heroku master
```

<br>

<h1 style="text-align: center;"> 👨‍💻 Developed by Adrián Coll. </h1>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) 

