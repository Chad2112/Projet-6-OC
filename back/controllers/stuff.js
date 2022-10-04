const sauce = require("../models/stuff");
const fs = require("fs");

exports.createsauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const Sauce = new sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  Sauce.save()
    .then(() => res.status(201).json({ message: "Nouvelle sauce enregister" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  sauce
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getSauces = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })

    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

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
