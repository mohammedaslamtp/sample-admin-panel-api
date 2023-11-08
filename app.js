require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// cors
const corsOptions = {
  origin: process.env.URL,
  methods: "GET, POST, PUT ,DELETE ,PATCH, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// routes representation
const user_route = require("./routes/user_route");
const admin_route = require("./routes/admin_route");

// mongoose connection
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on("error", (error) => console.log("db error: ", error));
db.once("open", () => console.log("db connected"));

app.use("/", user_route);
app.use("/admin", admin_route);

// port
const server = app.listen(process.env.PORT || 3000);
