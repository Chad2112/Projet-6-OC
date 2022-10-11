// Importation d'express
const express = require("express");
//Importation de mongoose pour la connexion a la base de donnée
const bodyParser = require("body-parser");
const cors = require("cors");
// Ajout de path pour intéragir avec les fichier
const path = require("path");
const app = express();
// Importation des routes présent dans leur fichier respectif
//const userRoutesSignup = require("./routes/user");
//const userRoutesLogin = require("./routes/user");
const connectDB = require("./config/connexionDB");
const userRouter = require("./routes/user");
const saucesRoutes = require("./routes/stuff");
// Importation du package dotenv pour importer les varibale d'environnement notamment pour la connexion a mongoDB
const dotenv = require("dotenv");
const result = dotenv.config();

app.use(express.json());

// Connexion a la base de donnée MONGODB

connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,X-Request-With,Content-Type,Accept,Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
});
// BodyParser.json analyse le texte en tant que JSON et expose l'objet résultant sur req.body

app.use(bodyParser.json());
// Utilisation par l'app.js des routes vers l'API pour l'inscription, la connexion ainsi que les requete POST GET etc...
/*
app.use("/api/v1/users",cors(), userRoutesSignup);
app.use("/api/auth/",cors(), userRoutesLogin);
*/
app.use("/api/auth/", cors(), userRouter);
app.use("/api/sauces/", cors(), saucesRoutes);
// Ajout du chemin statique pour fournir les images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
