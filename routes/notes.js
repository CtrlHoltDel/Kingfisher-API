const { getNotes, getNotesByPlayer } = require("../controllers/notes");

const notesRouter = require("express").Router();

notesRouter.get("/", getNotes);
notesRouter.get("/:player", getNotesByPlayer);

module.exports = notesRouter;
