// Importation de mongoose pour la creation d'un nouveau schéma
const mongoose = require("mongoose");
// Importation du package "unique-validator"
const uniqueValidator = require("mongoose-unique-validator");
// Ajout du schéma mongoose pour la création d'un nouvelle utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// Ajout de uniqueValidator sur le schema, car l'adresse mail doit etre unique pour l'inscription, si l'email est deja présent dans la base de données
// l'inscription sera refusé
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
