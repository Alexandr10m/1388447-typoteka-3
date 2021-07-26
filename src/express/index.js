"use strict";

const express = require(`express`);
const path = require(`path`);
const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articleRoutes = require(`./routes/article-routes`);

const DEFAULT_PORT = 8080;
const TEMPLATES_DIR = `templates`;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articleRoutes);

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT, () => console.info(`Listening to connections on ${DEFAULT_PORT}`));
