const { fetchUsers, amendUser } = require("../models/admin");

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
