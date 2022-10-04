const sauce = require("../models/stuff");
const fs = require("fs");

//Creation du middlewale pour la création d'un nouvel objet via une requete POST

exports.createsauce = (req, res, next) => {
  // Recuperation de l'objet, parsé et suppresion de l'id automatiquement généré par MONGODB et de L'userid pour le remplacer par le token d'identification
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const Sauce = new sauce({
    ...sauceObject,
    userId: req.auth.userId,
    // Ajout de l'url d'image protocol http suivi du port en localhost du dossier dans lequel stocker l'image et enfin le nom du fichier
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  // Sauvegarde de la nouvelle sauce dans l'api
  Sauce.save()
    .then(() => res.status(201).json({ message: "Nouvelle sauce enregister" }))
    .catch((error) => res.status(400).json({ error }));
};

// Creation d'un middleware pour la requête get afin de recuperer tout les objet présent dans l'api

exports.getAllSauce = (req, res, next) => {
  sauce
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Creation d'un middleware pour la requete get afin de recuperer un seul objet de l'api identifié par son id

exports.getSauces = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })

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

  delete sauceObject._userId;
  sauce
    .findOne({ _id: req.params.id })
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        sauce
          .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet Modifié" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

// Creation d'un middleware pour permettre de supprimer un objet de l'api en verifiant comme pour le requête put si l'utilisateur qui souhaite
// supprimer l'objet est bien celui qui la précedemment créé.

exports.deleteSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        const filename = sauces.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          sauce
            .deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimer" }))
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Creation d'un middleware pour pouvoir ajouter et retirer un like et/ou un dislike sur chaque objet, si l'utilisateur like ou dislike un objet,
// son userId est enregister dans le tableau correspondant, de façon a ce qu'il ne puisse liker ou diliker qu'une seule fois par produits

exports.addLikedDislike = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((objet) => {
      if (!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        sauce
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: 1 },
              $push: { usersLiked: req.body.userId },
            }
          )
          .then(() => res.status(201).json({ message: "like ajouté" }))
          .catch(() => res.status(400).json({ error }));
      } else if (objet.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        sauce
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            }
          )
          .then(() => res.status(201).json({ message: "Like retirer" }))
          .catch(() => res.status(400).json({ error }));
      }

      if (objet.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        sauce
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
          .then(() => res.status(201).json({ message: "Like retirer" }))
          .catch(() => res.status(400).json({ error }));
      }

      if (!objet.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        sauce
          .updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: 1 },
              $push: { usersDisliked: req.body.userId },
            }
          )
          .then(() => res.status(201).json({ message: "Like retirer" }))
          .catch(() => res.status(400).json({ error }));
      }
    })

    .catch(() => res.status(500).json({ error }));
};
