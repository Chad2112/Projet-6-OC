// Importation d'express
const express = require("express");
//Importation de mongoose pour la connexion a la base de donnée
const bodyParser = require("body-parser");
//Definition de cors :
//afin de permettre à un agent utilisateur d'accéder à des ressources d'un serveur situé sur une
//autre origine que le site courant
const cors = require("cors");
// Ajout de path pour intéragir avec les fichier
const path = require("path");
const app = express();
// Importation des routes présent dans leur fichier respectif
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
  // On spécifie l'entête pour le CORS
  res.header("Access-Control-Allow-Origin", "*");
  // On gère le cas où le navigateur fait un pré-contrôle avec OPTIONS ...
  // ... pas besoin d'aller plus loin dans le traitement, on renvoie la réponse
  if (req.method === "OPTIONS") {
    // On liste des méthodes et les entêtes valides
    res.header("Access-Control-Allow-Headers", "Origin,X-Request-With,Content-Type,Accept,Authorization");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
});
// BodyParser.json analyse le texte en tant que JSON et expose l'objet résultant sur req.body

app.use(bodyParser.json());
// Utilisation par l'app.js des routes vers l'API pour l'inscription, la connexion ainsi que les requete POST GET etc...
app.use("/api/auth/", cors(), userRouter);
app.use("/api/sauces/", cors(), saucesRoutes);
// Ajout du chemin statique pour fournir les images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
