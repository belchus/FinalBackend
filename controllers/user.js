const { userFactory } = require("../repository/userFactory.js");
const { errorCheck } = require("../utils/errorCheck.js");


//controllers para los usuarios

async function allUsers(req, res) {
  const result = await userFactory.allUsers();
  errorCheck(req, res, result);
}

async function userById(req, res) {
  const result = await userFactory.userById(req.params.id);
  errorCheck(req, res, result);
}

async function newUser2(req, res) {
  const file = req.file;
  req.body.avatar = `avatars/${file.filename}`;
  const result = await userFactory.save(req.body);
  errorCheck(req, res, result);
}

async function modifyUser(req, res) {
  const result = await userFactory.update(req.body, req.params.id);
  errorCheck(req, res, result);
}

async function deleteUser(req, res) {
  const result = await userFactory.delete(req.params.id);
  errorCheck(req, res, result);
}

function login(req, res) {
  const result = userFactory.setUserOnline(req.body);
  errorCheck(req, res, result);
}

module.exports = { allUsers, userById, newUser2,  modifyUser,  deleteUser, login,};
