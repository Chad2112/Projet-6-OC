// Importation d'express
const express = require("express");
//Importation de mongoose pour la connexion a la base de donnée
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// Ajout de path pour intéragir avec les fichier
const path = require("path");
const app = express();
// Importation des routes présent dans leur fichier respectif
const userRoutesSignup = require("./routes/user");
const userRoutesLogin = require("./routes/user");
const saucesRoutes = require("./routes/stuff");
// Importation du package dotenv pour importer les varibale d'environnement notamment pour la connexion a mongoDB
const dotenv = require("dotenv");
const result = dotenv.config();

app.use(express.json());

// Connexion a la base de donnée MONGODB

mongoose
  .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ia6fzmd.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Conncexion à MongoDB échouée !"));

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
app.use("/api/auth/", userRoutesSignup);
app.use("/api/auth/", userRoutesLogin);
app.use("/api/sauces/", saucesRoutes);
// Ajout du chemin statique pour fournir les images
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
