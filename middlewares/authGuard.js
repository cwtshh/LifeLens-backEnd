const user = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    // checa se o header tem um token
    if(!token) {
        return res.status(401).json({
            errors: ['Acesso negado.']
        });
    }

    try {
        const verified = jwt.verify(token, jwtSecret);

        req.user = await user.findById(verified.id).select('-password');

        next();

    } catch (e) {
        res.status(401).json({
            errors: ['token inválido.']
        });
    }
};

module.exports = authGuard;