const express = require("express");
const cors = require("cors");

const { customError } = require("./errors/errors");

const backupRouter = require("./routes/backup");
const notesRouter = require("./routes/notes");
const playersRouter = require("./routes/players");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).sendFile(`${__dirname}/index.json`);
});

app.use("/players", playersRouter);
app.use("/notes", notesRouter);
app.use("/backup", backupRouter);

// app.get("/*", (req, res, next) => {
//   res.redirect("/");
// });

app.use(customError);

module.exports = app;
