const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, courtController.createCourt);
router.get('/', courtController.getCourts);
router.get('/:id', courtController.getCourtById);

module.exports = router;