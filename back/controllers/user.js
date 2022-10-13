// Importation d'un package bcrypt pour permettre de hasher le password de chaque utilisateur avant de l'enregistrer dans la base de données
const bcrypt = require("bcrypt");
// Importation du model mongoose USER
const User = require("../models/user");
// Importation du packake jsonwebtoken pour attribuer un token par utilisateur
const jwt = require("jsonwebtoken");

const mongoMask = require("mongo-mask");

// Creation du middleware pour l'inscription de l'utilisateur
exports.signup = (req, res, next) => {
  //Cryptage du password grâce a Bcrypt
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Le nouvelle utilisateur sera enregistrer dans la base de donnée avec son email et son mot de passe hashé
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Creation du middleware pour que l'utilisateur précedement inscrit puissent se connecter:

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      // si l'email n'est pas présent dans la base de données le serveur renvoi une erreur 401
      if (user === null) {
        res.status(401).json({ message: `L'utilisateur et/ou le mot de passe est incorrect` });
      } else {
        // Si l'email est présent dans la base de données bcrypt compare le mot de passe entrée avec celui présent dans la base de donnée
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            // Si le mot de passe ne correspond pas une erreur est renvoyer
            if (!valid) {
              res.status(401).json({ message: `L'utilisateur et/ou le mot de passe est incorrect` });
            } else {
              // Si le mot de passe correspond, la connexion est autorisé un userId est attribué ainsi qu'un token de connexion qui expirera sous 24h
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
