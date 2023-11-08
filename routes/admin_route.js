const express = require("express");
const route = express.Router();
const auth_controller = require("../controllers/auth_controller");
const actions_controller = require("../controllers/actions_controller");
const jwt = require("../middlewares/jwt");

route
  .post("/adminLogin", auth_controller.admin_login)
  .get("/isLoggedIn", jwt.adminAuthenticate, auth_controller.isAdminLoggedIn)
  .get("/getUsersData", jwt.adminAuthenticate, actions_controller.getUsersData)
  .get("/getUser", jwt.adminAuthenticate, auth_controller.getUserWithId)
  .post("/addUser", jwt.adminAuthenticate, actions_controller.addUser)
  .put("/editUser", jwt.adminAuthenticate, actions_controller.editUser)
  .delete("/deleteUser", jwt.adminAuthenticate, actions_controller.deleteUser);

module.exports = route;
