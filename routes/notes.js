const {
  getNotes,
  getNotesByPlayer,
  postNote,
  delNote,
  patchNote,
} = require("../controllers/notes");

const notesRouter = require("express").Router();

notesRouter.route("/").get(getNotes);
notesRouter.route("/:id").delete(delNote).patch(patchNote);
notesRouter.route("/:player").get(getNotesByPlayer).post(postNote);

module.exports = notesRouter;
