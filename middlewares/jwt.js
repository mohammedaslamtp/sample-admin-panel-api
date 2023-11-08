const jwt = require("jsonwebtoken");
const admin_model = require("../models/admins_model");
const user_model = require("../models/users_model");

function adminAuthToken(req, res, next) {
  const response = {};
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json("401");
  }

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, data) => {
    if (err) {
      response.error = err.message;
      if (err.expiredAt) {
        response.expiredAt = err.expiredAt;
      }
      return res.status(401).json(response);
    } else {
      if (data) {
        const adminData = await admin_model.findOne({ email: data.email });
        req.admin = adminData;
      } else {
        req.admin = null;
      }
    }
    next();
  });
}

function userAuthToken(req, res, next) {
  const response = {};
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json("401");
  }

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, async (err, data) => {
    if (err) {
      response.error = err.message;
      if (err.expiredAt) {
        response.expiredAt = err.expiredAt;
      }
      return res.status(401).json(response);
    } else {
      if (data) {
        const userData = await user_model.findOne({ email: data.email });
        req.user = userData;
      } else {
        req.user = null;
      }
    }
    next();
  });
}

module.exports = { adminAuthenticate: adminAuthToken, userAuthToken: userAuthToken };
