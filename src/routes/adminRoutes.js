const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/pending-requests', authMiddleware.admin, adminController.getPendingRequests);
router.post('/approve-booking/:id', authMiddleware.admin, adminController.approveBooking);
router.post('/approve-owner/:id', authMiddleware.admin, adminController.approveOwner);

module.exports = router;