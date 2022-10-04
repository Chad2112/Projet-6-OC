const express = require("express");
const Router = express.Router();
const userCtrl = require("../controllers/user");

Router.post("/signup", userCtrl.signup);
Router.post("/login", userCtrl.login);
module.exports = Router;
