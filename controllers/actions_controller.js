const user_model = require("../models/users_model");
const bcrypt = require("bcrypt");
const responseModel = {
  status: 200,
  data: {},
  message: "failed",
  authentication: true
};

module.exports = {
  getUsersData: (req, res) => {
    const response = responseModel;
    user_model
      .find()
      .then((users) => {
        if (users) {
          response.data = users;
          res.status(200).json(response.data);
        }
      })
      .catch((e) => {
        response.message = "Server maintenance!";
        res.status(404).json(response);
      });
  },

  addUser: (req, res) => {
    const data = req.body;
    const response = responseModel;
    try {
      if (!data.username) {
        response.message = "Username or email is required!";
        res.status(201).json(response);
      } else if (!data.password) {
        response.message = "Password is required!";
        res.status(201).json(response);
      } else if (!data.email) {
        response.message = "Email is required!";
        res.status(201).json(response);
      } else if (!data.phone) {
        response.message = "Phone is required!";
        res.status(201).json(response);
      } else if (!data.full_name) {
        response.message = "Full name is required!";
        res.status(201).json(response);
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash_password = bcrypt.hashSync(data.password, salt);
        user_model
          .create({
            full_name: data.full_name,
            username: String(data.username).toLowerCase(),
            password: hash_password,
            email: String(data.email).toLowerCase(),
            phone: data.phone
          })
          .then((result) => {
            response.message = "Successfully created";
            res.status(200).json(response);
          })
          .catch((e) => {
            response.message = "Server maintenance!";
            if (e.code === 11000) {
              response.message = `Email or usename already exist!`;
            }
            res.status(404).json(response);
          });
      }
    } catch (error) {
      response.message = error.message;

      res.status(404).json(response);
    }
  },

  editUser: (req, res) => {
    const data = req.body;
    const response = responseModel;
    try {
      if (!data.username) {
        response.message = "Username or email is required!";
        res.status(201).json(response);
      } else if (!data.email) {
        response.message = "Email is required!";
        res.status(201).json(response);
      } else if (!data.phone) {
        response.message = "Phone is required!";
        res.status(201).json(response);
      } else if (!data.full_name) {
        response.message = "Full name is required!";
        res.status(201).json(response);
      } else {
        user_model
          .findByIdAndUpdate(req.query.id, {
            $set: {
              full_name: data.full_name,
              phone: data.phone,
              username: String(data.username).toLowerCase(),
              email: String(data.email).toLowerCase()
            }
          })
          .then((result) => {
            if (result) {
              response.message = "Edited successfully";
              res.status(200).json(response);
            }
          })
          .catch((e) => {
            response.message = "Server maintenance!";
            if (error.code === 11000) {
              response.message = `Email or username already exist!`;
            }
            res.status(404).json(response);
          });
      }
    } catch (error) {
      response.message = error.message;
      res.status(404).json(response);
    }
  },

  deleteUser: (req, res) => {
    const id = req.query.id;
    const response = responseModel;
    user_model
      .findByIdAndDelete(id)
      .then((result) => {
        response.authentication = true;
        response.message = "Deleted Successfully";
        response.status = 200;
        res.status(200).json(response);
      })
      .catch((e) => {
        response.message = "Server maintenance!";
        res.status(404).json(response);
      });
  }
};
