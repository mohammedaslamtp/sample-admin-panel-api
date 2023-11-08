const express = require("express");
const route = express.Router();
const auth_controller = require("../controllers/auth_controller");
const jwt = require("../middlewares/jwt");

route
  .post("/userLogin", auth_controller.user_login)
  .get("/isUserLoggedIn", jwt.userAuthToken, auth_controller.isUserLoggedIn)
  .get("/userData", jwt.userAuthToken, auth_controller.getUser)
  .patch("/logout", jwt.userAuthToken, auth_controller.logout);

module.exports = route;
