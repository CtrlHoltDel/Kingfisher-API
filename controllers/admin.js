const {
  fetchUsers,
  amendUser,
  removeUser,
  fetchRecent,
  createKey,
} = require("../models/admin");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  try {
    const user = await amendUser(req.params, req.body);
    res.status(201).send({ user });
  } catch (error) {
    next(error);
  }
};

exports.delUser = async (req, res, next) => {
  try {
    await removeUser(req.params);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getRecent = async (req, res, next) => {
  try {
    const recent = await fetchRecent();
    res.status(200).send({ recent });
  } catch (err) {
    next(err);
  }
};

exports.generateKey = async (req, res, next) => {
  try {
    const key = await createKey(req.authData.user);
    res.send({ key });
  } catch (err) {
    next(err);
  }
};
