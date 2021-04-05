const multer = require ('multer');

// Définition du format d'images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};
// On indique ou stocker les images (dans ce cas-là, dans le dossier 'images' du Back)
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'images');
    },
    // Modifications du nom d'origine et remplacement des espaces par des underscore
    filename: (req, file, callback)=>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');