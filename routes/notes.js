const {
  getNotes,
  getNotesByPlayer,
  postNote,
  delNote,
} = require("../controllers/notes");

const notesRouter = require("express").Router();

notesRouter.route("/").get(getNotes).delete(delNote);
notesRouter.route("/:player").get(getNotesByPlayer).post(postNote);

module.exports = notesRouter;
