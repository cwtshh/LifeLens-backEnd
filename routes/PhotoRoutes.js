const express = require('express');
const router = express.Router();

// controller
const { insertPhoto } = require('../controllers/PhotoController');

// middlewares
const { photoCreateValidation } = require('../middlewares/photoValidation');
const authGuard = require('../middlewares/authGuard');
const validate = require('../middlewares/handleValidation');
const { imageUpload } = require('../middlewares/imageUpload');

// routes
router.post('/', authGuard, imageUpload.single('image'), photoCreateValidation(), validate, insertPhoto);

module.exports = router;