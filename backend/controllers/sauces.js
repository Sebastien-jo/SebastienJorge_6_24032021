const Sauce = require('../models/sauce');
const fs = require('fs');

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next)=>{
    const sauceObject = JSON.parse(req.body.sauce);
    // supression de l'id de la sauce généré par le frontend
    delete req.body._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Sauvegarde de la sauce dans la base de données
    sauce.save()
        .then(()=> res.status(201).json({message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({error}));
},

// Modification d'une sauce
exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(()=> res.status(200).json({message: 'Sauce Modifié'}))
        .catch(error => res.status(400).json({error}));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next)=> {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id})
                    .then(()=> res.status(200).json({message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};


// Permet de récupérer une seule sauce, identifiée par son id
exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.satus(404).json({error}));
};

// Permet de récuperer toutes les sauces de la base MongoDB
exports.getAllSauce = (req, res, next) =>{
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

// permet le "like" ou le "dislike" d'une sauce
exports.likeDislike = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    if (like === 1){
        Sauce.updateOne({_id: sauceId},{
            $push:{usersLiked: userId},
            $inc: {likes: +1},
        })
        .then(() => res.satus(200).json({message: 'Like ajouté !'}))
        .catch(error=> res.satus(400).json({error}));
    }
    if (like === -1){
        Sauce.updateOne ({
            _id: sauceId
        },{
            $push: {usersDisliked: userId},
        })
        .then(()=> res.status(200).json({message: 'Dislike ajouté !'}))
        .catch((error)=> res.status(400).json({error}))
    }
    if (like === 0){
        Sauce.findOne({_id: sauceId})
        .then((sauce)=>{
            if(sauce.userLiked.includes(userId)){
                Sauce.updateOne({_id: sauceId},{
                    $pull: {userLiked: userId},
                    $inc: {likes: -1},
                })
                .then(() => res.status(200).json({message: 'Like retiré !'}))
                .catch((error)=> res.status(400).json({error}))
            }
            if(sauce.usersDisliked.includes(userId)){
                sauce.updateOne({_id: sauceId},{
                    $pull: {userDisliked: userId},
                    $inc: {dislikes: -1},
                })
                .then(()=> res.status(200).json({message: 'Dislike retiré'}))
                .catch((error)=> res.status(400).json({error}))
            }
        })
        .catch((error)=> res.status(404).json({error}))
    }
}