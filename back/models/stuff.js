const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Definition du schema pour les requête POST vers l'API
const sauceSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  } /*{ type: String, required: true },*/,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  mainPepper: {
    type: String,
    required: true,
  },
  heat: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  usersLiked: {
    type: [String],
  },
  usersDisliked: {
    type: [String],
  },
});
sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Sauce", sauceSchema);
