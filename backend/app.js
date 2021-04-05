const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');
/*Helmet aide à protéger l'application de certaines des vulnérabilités 
bien connues du Web en configurant de manière appropriée des en-têtes HTTP.*/
const helmet = require('helmet');
/*noCache définit des en-têtes Cache-Control 
et Pragma pour désactiver la mise en cache côté client.*/
const nocache = require('nocache');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
/* utilisation du module 'dotenv' pour masquer les informations de connexion
 à la base de données à l'aide de variables d'environnement*/
require('dotenv').config();


// Connection à MongoDB
mongoose.connect('mongodb+srv://seb_j:CarotteNavetPoireauxLapin@cluster0.ymnzh.mongodb.net/seb_j?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true})
    .then(() => console.log('Connexion à Mongodb réussie !'))
    .catch(() => console.log('Connexion à Mongodb échouée !'));



    const app = express();
/* Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, 
afin que tout le monde puisse faire des requetes depuis son navigateur*/
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});


// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.urlencoded({
  extended: true
}));

// Utilisation de la méthode body-parser pour la transformation du corps de la requête en JSON, en objet JS utilisable
app.use(bodyParser.json());
app.use(helmet());
app.use(nocache());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;

