
const bcrypt = require('bcrypt')
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware pour crée un nouvel utilisateur
// On sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
     
      const user = new User({
       
        email: req.body.email,
        
        password: hash
      });
     // Enregistre l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({
          message: 'Utilisateur créé !'
        }))
        // Si il y a déjà un utilisateur avec cette adresse mail envoyer message d'erreur
        .catch(error => res.status(400).json({
          error
        })); 
    })
    .catch(error => res.status(500).json({
      error
    }));

};

// Middleware pour la connexion d'un utilisateur sauvegarder dans la base de données.
// Si il existe vérification du mot de passe avec envoie d'un token sinon envoie d'un message d'erreur
exports.login = (req, res, next) => {
  
  User.findOne({
      email: req.body.email
    })
    .then(user => {
     
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          
          res.status(200).json({ 
            userId: user._id,
            
            token: jwt.sign( 
              {
                userId: user._id
              }, 
              'RANDOM_TOKEN_SECRET', 
              {
                expiresIn: '6h'
              }
            )
 
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};