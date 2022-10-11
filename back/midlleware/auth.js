// Ajout du package jsonwebtoken pour la création d'un token unique par utilisateur
const jwt = require("jsonwebtoken");

// Création du middleware pour décoder le TOKEN
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
