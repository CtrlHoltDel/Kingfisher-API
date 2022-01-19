const express = require("express");
const db = require("./db/connection");
const { customError } = require("./errors/errors");
const backupRouter = require("./routes/backup");

const playersRouter = require("./routes/players");
const backup = require("./utils/backup");

const app = express();

app.use(express.json());

app.use("/players", playersRouter);
app.use("/backup", backupRouter);

app.use(customError);

module.exports = app;
