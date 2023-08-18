const express = require('express');
const router = express();

router.use('/api/users', require('./UserRoutes'));

// rota de teste
router.get('/', (req, res) => {
    res.send('API funcionando!');
});



module.exports = router;