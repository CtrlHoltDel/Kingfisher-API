const express = require("express");
const { customError } = require("./errors/errors");

const backupRouter = require("./routes/backup");
const notesRouter = require("./routes/notes");
const playersRouter = require("./routes/players");

const app = express();

app.use(express.json());

app.use("/players", playersRouter);
app.use("/notes", notesRouter);
app.use("/backup", backupRouter);

app.use(customError);

module.exports = app;
