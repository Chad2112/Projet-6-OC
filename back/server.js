// Importer le package HTTP de node
const http = require("http");
//Importer l'application app.js
const app = require("./app");
//Importer le package pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

//Parametrage du port avec la methode set
app.set("port", process.env.PORT);

// La methode create server prend en argument la fonction qui sera appelé a chaque requête
const server = http.createServer(app);
//Le server ecoute les requête sur le port defini dans la variable d'environement ('env')
server.listen(process.env.PORT);
