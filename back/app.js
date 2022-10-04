const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const userRoutesSignup = require("./routes/user");
const userRoutesLogin = require("./routes/user");
const saucesRoutes = require("./routes/stuff");
const dotenv = require("dotenv");
const result = dotenv.config();

app.use(express.json());

mongoose
  .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ia6fzmd.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Conncexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(bodyParser.json());
// app.use("/api/stuff", stuffRoutes);
app.use("/api/auth/", userRoutesSignup);
app.use("/api/auth/", userRoutesLogin);
app.use("/api/sauces/", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
