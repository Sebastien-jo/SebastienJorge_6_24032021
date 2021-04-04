const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');
const helmet = require('helmet');
const nocache = require('nocache');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

require('dotenv').config();



mongoose.connect('mongodb+srv://seb_j:CarotteNavetPoireauxLapin@cluster0.ymnzh.mongodb.net/seb_j?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true})
    .then(() => console.log('Connexion à Mongodb réussie !'))
    .catch(() => console.log('Connexion à Mongodb échouée !'));



    const app = express();

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});



app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(bodyParser.json());
app.use(helmet());
app.use(nocache());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;

