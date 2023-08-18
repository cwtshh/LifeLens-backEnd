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
        res.status(422).json({ errors: ['Erro ao criar a foto.'] });
        return;
    }

    res.status(201).json(newPhoto);
};

// remove a foto
const deletePhoto = async(req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        if(!photo) {
            res.status(404).json({ errors: ['Foto não encontrada.'] });
            return;
        }
    
        // checa se a foto pertence ao usuario
        if(!photo.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ['Ocorreu um erro, por favor, tente novamente mais tarde.'] });
            return;
        }
    
        await Photo.findByIdAndDelete(photo._id);
    
        res.status(200).json(
            {
                id: photo._id,
                message: 'Foto deletada com sucesso.'
            }
        );
    } catch (e) {
        res.status(404).json({ errors: ['Foto não encontrada.'] });
        return;
    }

};

// resgata todas as fotos
const getAllPhotos = async(req, res) => {
    const photos = await Photo.find({}).sort([['createdAt', -1]]).exec();

    return res.status(200).json(photos);
}

// resgata as fotos de um usuario
const getUserPhotos = async(req, res) => {
    const { id } = req.params;

    const photos = await Photo.find({userId: id}).sort([['createdAt', -1]]).exec();

    res.status(200).json(photos);
}

// resgata foto por id
const getPhotoById = async(req, res) => {
    const { id } = req.params;

    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // checa se a foto chegou
    if(!photo) {
        res.status(404).json({ errors: ['Foto não encontrada.'] });
        return;
    }

    res.status(200).json(photo);
};

// atualiza a foto
const updatePhoto = async(req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // checa se a foto existe
    if(!photo) {
        res.status(404).json({ errors: ['Foto não encontrada.'] });
        return;
    }

    // checa se a foto pertence ao usuario
    if(!photo.userId.equals(reqUser._id)) {
        res.status(422).json({ errors: ['Ocorreu um erro, por favor, tente novamente mais tarde.'] });
        return;
    }

    // atualiza a foto
    if(title) {
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({photo, message: 'Foto atualizada com sucesso.'});
};

// dar like na foto
const likePhoto = async(req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // checa se a foto existe
    if(!photo) {
        res.status(404).json({ errors: ['Foto não encontrada.'] });
        return;
    }

    // checa se o usuario ja deu like na foto
    if(photo.likes.includes(reqUser._id)) {
        res.status(422).json({ errors: ['Você já deu like nesta foto.'] });
        return;
    }

    // coloca o id do usuario no array de likes
    photo.likes.push(reqUser._id);

    photo.save();

    res.status(200).json({photoId: id, userId: reqUser._id, message: 'Foto curtida com sucesso.'});
};

// comentar numa foto
const commentPhoto = async(req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);
    if(!photo) {
        res.status(404).json({ errors: ['Foto não encontrada.'] });
        return;
    }

    // adiciona a foto num array de comentarios
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };

    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json(
        {
            comment: userComment,
            message: 'Comentário adicionado com sucesso.'
        }
    );
};

// buscar fotos por titulo
const searchPhotos = async(req, res) => {
    const { q } = req.query;

    const photos = await Photo.find({title: new RegExp(q, 'i')}).exec();

    res.status(200).json(photos);
}

module.exports = { 
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
};