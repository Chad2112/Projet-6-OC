const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/stuff");
const multer = require("../midlleware/multer-config");
const auth = require("../midlleware/auth");
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./images/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
//     cb(null, new Error("Format non pris en charge !!!"));
//   } else {
//     cb(null, false);
//   }
// };
// const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });

router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getSauces);
router.post("/", auth, multer, sauceCtrl.createsauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.post("/:id/like", auth, sauceCtrl.addLikedDislike);

module.exports = router;
