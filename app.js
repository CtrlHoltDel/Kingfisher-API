const express = require("express");
const { customError } = require("./errors/errors");
const playersRouter = require("./routes/players");

const app = express();

app.use(express.json());

app.use("/players", playersRouter);

app.use(customError);

module.exports = app;
