const {body} = require('express-validator');

const userCreateValidation = () => {
    return [
        body('name')
            .isString()
            .withMessage('O nome é obrigatório.')
            .isLength({ min: 3})
            .withMessage('O nome deve ter no minimo 3 caracteres.'),
        body('email')
            .isString()
            .withMessage('O email é obrigatório.')
            .isEmail()
            .withMessage('Insira um email válido.'),
        body('password')
            .isString()
            .withMessage('A senha é obrigatória.')
            .isLength({ min: 5})
            .withMessage('A senha deve ter no minimo 5 caracteres.'),
        body('confirmPassword')
            .isString()
            .withMessage('A confirmação de senha é obrigatória.')
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('As senhas não conferem.');
                }
                return true;
            })
    ];
};

const loginValidation = () => {
    return [
        body('email')
            .isString()
            .withMessage('O email é obrigatório.')
            .isEmail()
            .withMessage('Insira um email válido.'),
        body('password')
            .isString()
            .withMessage('A senha é obrigatória.')
    ]
};

module.exports = {
    userCreateValidation,
    loginValidation,
};