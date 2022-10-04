const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/stuff");
const multer = require("../midlleware/multer-config");
const auth = require("../midlleware/auth");

//Toutes les routes vers l'API sont ci-dessous :
// La const auth, verifie si l'utilisateur est bien authentifier avec un token de connexion
// avant de soummettre toutes requête
// La const multer est une fonction du package node qui permet d'envoyer des fichier via une requête
// Tout les details des middleware sont dans le fichier correspondant (controllers/stuff/)

router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getSauces);
router.post("/", auth, multer, sauceCtrl.createsauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.post("/:id/like", auth, sauceCtrl.addLikedDislike);

// Nous exportons la const router pour pouvoir l'utiliser dans app.js
module.exports = router;
