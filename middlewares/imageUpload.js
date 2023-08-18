const multer = require('multer');
const path = require('path');

// onde a imagem vai ser salva
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "";

        if(req.baseUrl.includes('users')) {
            folder = 'users';
        } else if(req.baseUrl.includes('photos')) {
            folder = 'photos';
        }

        cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            // aceita apenas pgn e jpg
            return cb(new Error('Apenas arquivos PNG e JPG são aceitos.'));
        }
        cb(undefined, true);
    }
});

module.exports = { imageUpload };