const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/stuff");
//const multer = require("../midlleware/multer-config");
const auth = require("../midlleware/auth");

const multer = require("multer");
//const { route } = require('./users');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Format non pris en charge !!!"));
  }
};
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });

//Toutes les routes vers l'API sont ci-dessous :
// La const auth, verifie si l'utilisateur est bien authentifier avec un token de connexion
// avant de soummettre toutes requête
// La const multer est une fonction du package node qui permet d'envoyer des fichier via une requête
// Tout les details des middleware sont dans le fichier correspondant (controllers/stuff/)

router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getSauces);
router.post("/", auth, upload.single("image"), sauceCtrl.createsauce);
router.delete("/:id", sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.post("/:id/like", auth, sauceCtrl.addLikedDislike);

// Nous exportons la const router pour pouvoir l'utiliser dans app.js
module.exports = router;
