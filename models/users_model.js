const mongoose = require("mongoose");

const users = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    full_name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    // is logged in or not
    is_active: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", users);
