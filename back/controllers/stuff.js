const Sauce = require("../models/stuff");
const fs = require("fs");
const mongoose = require("mongoose");
const { rejects } = require("assert");

//Creation du middlewale pour la création d'un nouvel objet via une requete POST

exports.createsauce = (req, res, next) => {
  // Création d'un condition pour pouvoir utilisé la requête via POSTMAN, si le req.body.sauce ne renvoi undefined on ajoute tout les champs dans la requête

  if (req.body.sauce == undefined) {
    const sauce = new Sauce({
      userId: req.auth.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      // Ajout de l'url d'image protocol http suivi du port en localhost du dossier dans lequel stocker l'image et enfin le nom du fichier
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
    });
    console.log(sauce);

    sauce
      .save()
      .then(() => res.status(201).json({ message: "Nouvelle sauce enregister avec success" }))
      .catch((error) => res.status(400).json({ error: error }));

    // Sinon on recupere les information du corps de la requête on effectue un spread et on ajoute les autres information requise ensuite
  } else {
    // Recuperation de l'objet, parsé.
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      // Ajout de l'url d'image protocol http suivi du port en localhost du dossier dans lequel stocker l'image et enfin le nom du fichier
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      usersLiked: req.body.usersLiked,
      usersDisliked: req.body.usersDisliked,
    });

    // Sauvegarde de la nouvelle sauce dans la base de donnée
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Nouvelle sauce enregister avec success" }))
      .catch((error) => res.status(400).json({ error: error }));
  }
};

// Creation d'un middleware pour la requête get afin de recuperer tout les objet présent dans la base de donnée

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Creation d'un middleware pour la requete get afin de recuperer un seul objet de la base donnée identifié par son id

exports.getSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })

    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Creation d'un middleware pour la requete put afin de pouvoir modifier un objet seulement si l'utilisateur qui souhaite le modifer et également celui
// qui l'a créé.

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  console.log(sauceObject);

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        // Suppresion de l'ancienne image de la base de donnée
        const path = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${path}`, () => {
          //Modification de l'objet de la base de donnée, avec son nouveau descriptif et/ou nouvelle image
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })

            .then(() => res.status(200).json({ message: "Objet Modifié" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

// Creation d'un middleware pour permettre de supprimer un objet de l'api en verifiant comme pour le requête put si l'utilisateur qui souhaite
// supprimer l'objet est bien celui qui la précedemment créé.

exports.deleteSauce = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    // Utilisation mongoose.Types.ObjectId pour gerer  la supression des sauces qui
    // ne sont pas dans la DB
    Sauce.findOne({
      _id: req.params.id,
    }).then((sauce) => {
      try {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: "Non-autorisé" });
        } else {
          const path = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${path}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: "Sauce suprimer avec success" }))
              .catch((error) => res.status(400).json({ error: error }));
          });
        }
      } catch (TypeError) {
        res.status(404).json({ error: "Cette sauce n'existe pas !!!" });
      }
    });
  } else {
    rejects({ sucess: "false", data: "Please provide correct id" });
  }
};

// Creation d'un middleware pour pouvoir ajouter et retirer un like et/ou un dislike sur chaque objet, si l'utilisateur like ou dislike un objet,
// son userId est enregister dans le tableau correspondant, de façon a ce qu'il ne puisse liker ou diliker qu'une seule fois par produits

exports.addLikedDislike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((objet) => {
      // Si l'utilisateur like un produit on ajoute son userID dans le tableau userliked, et on ajout 1 au likes
      if (!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "like ajouté" }))
          .catch(() => res.status(400).json({ error }));
      } else if (
        //// Si l'utilisateur retire son like d'un produit on retire son userID du tableau userliked, et on retire 1 au likes
        objet.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Like retirer" }))
          .catch(() => res.status(400).json({ error }));
      }
      // Si l'utilisateur dislike un produit on ajoute son userID dans le tableau userDisliked, et on ajout 1 au dislikes
      if (!objet.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "DisLike retirer" }))
          .catch(() => res.status(400).json({ error }));
      }
      // Si l'utilisateur retire son dislike d'un produit on retire son userID du tableau userDisliked, et on retire un de dislikes
      if (objet.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "DisLike retirer" }))
          .catch(() => res.status(400).json({ error }));
      }
    })

    .catch(() => res.status(500).json({ error }));
};
