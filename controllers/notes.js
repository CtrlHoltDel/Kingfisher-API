const {
  fetchNotes,
  fetchNotesByPlayer,
  insertNote,
  removeNote,
} = require("../models/notes");

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

exports.postNote = async (req, res, next) => {
  try {
    const note = await insertNote(req.body, req.params);
    res.status(201).send({ note });
  } catch (err) {
    next(err);
  }
};

exports.delNote = async (req, res, next) => {
  try {
    await removeNote(req.body);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
