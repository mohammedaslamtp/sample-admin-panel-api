const mongoose = require("mongoose");

const admins = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("admins", admins);
