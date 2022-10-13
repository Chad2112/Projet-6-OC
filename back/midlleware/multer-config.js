const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  //Definition du nom du fichier en y ajoutant une date (new Date.toIsoString) et le nom du fichier de base
  //file.originalname
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

// Creation d'un fonction qui accepte uniquement les images au format jpg/jpeg/png, sinon on renvoi une
// erreur format non pris en charge
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Format non pris en charge !!!"));
  }
};

//Storage = stockage du fichier en mémoire
// Limits, fileSize = Limite la taille du fichier en octets
//Filefilter = filtre les fichier accépté ou non
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });

//Export de la constante upload pour l'utilisé dans l'app.js
module.exports = upload;
