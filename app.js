const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/.env.${ENV}`,
});

const express = require("express");
const cors = require("cors");
const { verifyUserToken, verifyAdmin } = require("./middleware/middleware");

const { customError, serverError } = require("./errors/errors");

const backupRouter = require("./routes/backup");
const notesRouter = require("./routes/notes");
const playersRouter = require("./routes/players");
const tendenciesRouter = require("./routes/tendencies");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");

const passport = require("passport");
require("./strategies/local");

const app = express();
const server = require("http").Server(app);

app.use(cors());
app.use(passport.initialize());
app.use(express.json());

const io = require("socket.io")(server, { cors: { origin: "*" } });

const { incrimentOnlineTime } = require("./models/socket");

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  let startingTime;
  let user;

  socket.on("login", (currUser) => {
    console.log(`${currUser} has logged in`);
    startingTime = Date.now();
    user = currUser;
  });

  socket.on("disconnect", async () => {
    console.log(`${user} has logged out`);
    const totalTime = Date.now() - startingTime;
    await incrimentOnlineTime(user, totalTime);
  });
});

app.get("/", (req, res, next) => {
  res.status(200).sendFile(`${__dirname}/endpoints.json`);
});

app.use("/auth", authRouter);
app.use("/backup", backupRouter);

app.use(verifyUserToken);

app.use("/players", playersRouter);
app.use("/notes", notesRouter);
app.use("/tendencies", tendenciesRouter);

app.use("/admin", verifyAdmin, adminRouter);

app.use(customError);
app.use(serverError);

module.exports = server;
