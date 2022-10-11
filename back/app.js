// Importation d'express
const express = require("express");
//Importation de mongoose pour la connexion a la base de donnée
const bodyParser = require("body-parser");
// Ajout de path pour intéragir avec les fichier
const path = require("path");
const app = express();
// Importation des routes présent dans leur fichier respectif

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/stuff");
// Importation du package dotenv pour importer les varibale d'environnement notamment pour la connexion a mongoDB
const dotenv = require("dotenv");
const result = dotenv.config();
const connectDB = require("./config/connexionDB");
app.use(express.json());

// Connexion a la base de donnée MONGODB
connectDB();

// Ajout des authorization pour la bonne communication entre l'utilisateur et l'API

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// BodyParser.json analyse le texte en tant que JSON et expose l'objet résultant sur req.body

app.use(bodyParser.json());
// Utilisation par l'app.js des routes vers l'API pour l'inscription, la connexion ainsi que les requete POST GET etc...
app.use("/api/auth/", userRoutes);
app.use("/api/sauces/", saucesRoutes);
// Ajout du chemin statique pour fournir les images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(function (err, req, res, next) {
  console.log(req.body);
  console.log("This is the invalid field ->", err.field);

  next(err);
});
module.exports = app;
