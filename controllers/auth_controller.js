const admin_model = require("../models/admins_model");
const user_model = require("../models/users_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const responseModel = {
  status: 404,
  data: {},
  message: "failed",
  authentication: false
};

module.exports = {
  admin_login: (req, res) => {
    const data = req.body;
    const response = responseModel;
    try {
      if (!data.username) {
        response.message = "Username or email is required!";
        res.status(201).json(response);
      } else if (!data.password) {
        response.message = "Password is required!";
        res.status(201).json(response);
      } else {
        if (data.username && data.password) {
          admin_model
            .findOne({ $or: [{ email: data.username }, { username: data.username }] })
            .then((result) => {
              if (result) {
                console.log("going to bcrypt: ", result);
                bcrypt.compare(data.password, result.password, (err, bcryptResult) => {
                  if (err) {
                    // bcryption error
                    console.log("bcryption error try again");
                  } else {
                    if (bcryptResult) {
                      console.log('bcrypt success', bcryptResult);
                      const adminData = {
                        username: result.username,
                        full_name: result.full_name,
                        email: result.email,
                        password: result.password
                      };

                      // giving 1 day expiration for jwt access token
                      const accessToken = jwt.sign(
                        adminData,
                        process.env.ACCESS_SECRET_TOKEN,
                        {
                          expiresIn: "24h"
                        }
                      );

                      response.data = {}
                      response.data.accessToken = accessToken;
                      response.authentication = true;
                      response.status = 200;
                      response.message = "Admin confirmed";
                      res.status(200).json(response);
                    } else {
                      response.status = 404;
                      response.message = "Password didn't match!";
                      res.status(404).json(response);
                    }
                  }
                });
              } else {
                response.status = 404;
                response.message = "Email or username does not match!";
                res.status(404).json(response);
              }
            })
            .catch((e) => {
              response.message = "Server maintenance!";
              res.status(404).json(response);
            });
        }
      }
    } catch (error) {
      response.message = e.message;
      res.status(404).json(response);
    }
  },

  isAdminLoggedIn: (req, res) => {
    res.status(200).json(req.admin ? true : false);
  },

  getUserWithId: (req, res) => {
    const id = req.query.id;
    const response = responseModel;
    user_model
      .findById(id)
      .then((user) => {
        if (user) {
          response.data = user;
          response.message = "ok";
          response.authentication = true;
          response.status = 200;
          res.status(200).json(response);
        } else {
          res.status(404).json(response);
        }
      })
      .catch((e) => {
        response.message = "Server maintenance!";
        res.status(404).json(response);
      });
  },

  getUser: (req, res) => {
    try {
      const user = req.user;
      const response = responseModel;
      response.data = user;
      response.authentication = true;
      response.status = 200;
      response.message = "ok";
      res.status(200).json(response);
    } catch (error) {
      response.authentication = false;
      response.status = 404;
      response.message = "failed";
      res.status(404).json(response);
    }
  },

  //   admin_creation: (req, res) => {
  //     console.log('calling ' ,req.body)
  //     const data = req.body;
  //     const response = responseModel;
  //     try {
  //       if (data) {
  //         const salt = bcrypt.genSaltSync(10);
  //         const hash_password = bcrypt.hashSync(data.password, salt);
  //         admin_model
  //           .create({
  //             username: data.username,
  //             full_name: data.full_name,
  //             email: data.email,
  //             password: hash_password
  //           })
  //           .then((result) => {
  //             if (result) {
  //               console.log("admin added: ", result);
  //               res.status(200).json("👍");
  //             }
  //           })
  //           .catch((e) => {
  //             response.message = "Server maintenance!";
  //             console.log("admin: email incorrect!, error:-- ", error);
  //             res.status(404).json("😒");
  //           });
  //       }
  //     } catch (error) {
  //       response.message = error.message;
  //       console.log(error.message)
  //       res.status(404).json(response);
  //     }
  //   },

  //   //
  //   //
  //   //
  //   //
  //   //

  user_login: (req, res) => {
    const data = req.body;
    const response = responseModel;
    try {
      if (!data.username) {
        response.message = "Username or email is required!";
        res.status(201).json(response);
      } else if (!data.password) {
        response.message = "Password is required!";
        res.status(201).json(response);
      } else {
        if (data.username && data.password) {
          user_model
            .findOne({ $or: [{ email: data.username }, { username: data.username }] })
            .then((result) => {
              if (result) {
                bcrypt.compare(data.password, result.password, (err, bcryptResult) => {
                  if (err) {
                    console.log("bcryption error try again");
                  } else {
                    if (bcryptResult) {
                      const user = {
                        username: result.username,
                        full_name: result.full_name,
                        email: result.email,
                        password: result.password
                      };

                      //creating and giving 10m expiration for jwt token
                      const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
                        expiresIn: "10m"
                      });


                      response.data = {};
                      response.data.accessToken = accessToken;
                      response.data.id = result._id;
                      response.authentication = true;
                      response.status = 200;
                      response.message = "Signin successful";
                      result.is_active = true;
                      result.save();
                      res.status(200).json(response);
                    } else {
                      response.status = 404;
                      response.message = "Incorrect password!";
                      res.status(404).json(response);
                    }
                  }
                });
              } else {
                response.status = 404;
                response.message = "Username or email does not match!";
                res.status(404).json(response);
              }
            })
            .catch((error) => {
              response.message = "Server maintenance!";
              res.status(404).json(response);
            });
        }
      }
    } catch (e) {
      response.message = e.message;
      res.status(404).json(response);
    }
  },

  isUserLoggedIn: (req, res) => {
    res.status(200).json(req.user ? true : false);
  },

  logout: (req, res) => {
    user_model
      .findByIdAndUpdate(req.user._id, { $set: { is_active: false } })
      .then((result) => {
        console.log("logout true: ", result);
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
