const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update-phone', auth, userController.updatePhoneNumber);

router.get('/pending', auth, userController.getPendingUsers);
router.put('/accept/:id', auth, userController.acceptUser);
router.delete('/deny/:id', auth, userController.denyUser);

module.exports = router;