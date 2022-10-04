// Importation du package Multer pour le transfert de fichier via les requête vers l'API
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Ajout d'un middleware avec un fonction callback pour enregister les images dans le dossier correspondant

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Création du nom du fichier dans cet ordre: Nom du fichier original suivi d'un underscore, de la date et enfin l'extension ex: jpg
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Export du multer qui pourra etre utilisé pour une seule images par requête post

module.exports = multer({ storage: storage }).single("image");
