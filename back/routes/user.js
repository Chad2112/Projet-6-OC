const express = require("express");
const Router = express.Router();
const userCtrl = require("../controllers/user");

// Definition des routes signup et login pour les requete d'authentification et d'inscription
Router.post("/signup", userCtrl.signup);
Router.post("/login", userCtrl.login);
module.exports = Router;
