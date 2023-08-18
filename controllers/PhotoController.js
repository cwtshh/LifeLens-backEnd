const Photo = require('../models/Photo');
const mongoose = require('mongoose');
const User = require('../models/User');

// inserir uma foto com um usuario logado
const insertPhoto = async(req, res) => {
    const { title } = req.body;
    const image = req.file.filename; 

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    // cria a foto
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // se a foto foi criada com sucesso, adiciona a foto no usuario
    if(!newPhoto) {
        res.status(422).json({ message: 'Erro ao criar a foto.' });
        return;
    }

    res.status(201).json(newPhoto);
};

module.exports = { 
    insertPhoto, 
};