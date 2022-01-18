const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).sendFile(`${__dirname}/views/index.html`);
});

module.exports = app;
