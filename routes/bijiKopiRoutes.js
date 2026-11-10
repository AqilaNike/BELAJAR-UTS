const express = require('express');
const router = express.Router();
const bijiKopiController = require('../controllers/bijiKopiController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', bijiKopiController.getAll);
router.get('/:id', bijiKopiController.getById);
router.post('/', cekApiKey, bijiKopiController.create);
router.put('/:id', cekApiKey, bijiKopiController.update);
router.delete('/:id', cekApiKey, bijiKopiController.remove);

module.exports = router;