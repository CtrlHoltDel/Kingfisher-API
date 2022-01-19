const { fetchNotes, fetchNotesByPlayer } = require("../models/notes");

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await fetchNotes(req.query);
    res.status(200).send(notes);
  } catch (err) {
    next(err);
  }
};

exports.getNotesByPlayer = async (req, res, next) => {
  try {
    const notes = await fetchNotesByPlayer(req.params);
    res.status(200).send(notes);
  } catch (err) {
    next(err);
  }
};
