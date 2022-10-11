const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });

const connectDB = async () => {
  const conn = await mongoose
    .connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.ia6fzmd.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à la base de donnée réussie !"))
    .catch((error) => console.log("Connexion à la base de donnée a échouée !" + error));
};

module.exports = connectDB;
