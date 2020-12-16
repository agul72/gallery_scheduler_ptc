const {Router} = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.end('<h1>This is API service. Please use api/ format to receive data</h1>')
});

module.exports = router;
