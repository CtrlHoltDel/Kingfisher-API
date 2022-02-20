const { fetchUsers, amendUser, removeUser } = require("../models/admin");

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
    console.log(error);
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
