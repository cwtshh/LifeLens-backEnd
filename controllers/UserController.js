const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

// generate user token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { expiresIn: '7d' });
};

// registrar user e logar
const register = async(req, res) => {
    const { name, email, password } = req.body;

    // checa se o user existe
    const user = await User.findOne({ email });

    if(user) {
        res.status(422).json({ errors: ['O email já está cadastrado.']});
        return;
    }

    // criptografa a senha
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // cria o user
    const newUser = User.create({
        name, 
        email, 
        password: passwordHash,
    });

    // checa se o user foi criado
    if(!newUser) {
        res.status(422).json({
            errors: ['Não foi possível cadastrar o usuário, por favor tente mais tarde.']
        });
        return;
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    });
};

// login
const login = async(req, res) => {
    const { email, password } = req.body; 

    const user = await User.findOne({ email });

    // checa se o user existe
    if(!user) {
        res.status(404).json({
            errors: ['Usuário não encontrado.']
        });
        return;
    }

    // checa se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
        res.status(401).json({
            errors: ['Senha inválida.']
        });
        return;
    }

    // retorna o usuario com token
    res.status(201).json(
        {
            _id: user._id,
            profileImage: user.profileImage,
            token: generateToken(user._id),
        }
    );
};

// recebe o usuario logado
const getCurrentUser = async(req, res) => {
    const user = req.user;

    res.status(422).json(user);
}

module.exports = {
    register,
    login,
    getCurrentUser,
};

