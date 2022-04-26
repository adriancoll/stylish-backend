# Backend for stylish mobile app

**Stylish REST API**, mounted on a `nodejs` and `expressjs` structure, with a `mongodb` database hosted on mongodb atlas.
Structure based on the <a href="https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller">MVC pattern</a>.

<br>

## About development

**First of all** you must install al node packages included in `package.json`, soo you must install first of all <a href="https://nodejs.org/es/download/">node</a>.

```
npm install
```

+ Once the installations are finished, you must generate the **JWTSecret key** the following command.

+ And then copy the key to the `.env` file on the `JWTSECRET` env variabe.
```
npm run secret:generate
```

+ Then you need to generate the Google Oauth2 client id and secret. On Google developer console. And then copy the keys to the `.env` file on the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env variables.

+ You need to create the mongo database and paste the connection to the `.env` file on the `MONGODB_URI` env variable.

<br>

When that's done, you can run the server with the following command.

```
npm run dev
```

<br>

## About production 

Deployed on <a href="https://stylish-backend.herokuapp.com/">Heroku</a>.
Linked with github repository, and the same database as development area.\
For pushing in production use always the most secure branch of the proyect, like `master`.

How to deploy:
```
git push heroku master
```

<br>

### 👨‍💻 Developed by Adrián Coll. 
