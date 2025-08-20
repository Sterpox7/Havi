const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getBookings);
router.get('/pending', auth, bookingController.getPendingBookings);
router.put('/accept/:id', auth, bookingController.acceptBooking);
router.delete('/deny/:id', auth, bookingController.denyBooking);
router.get('/occupied', bookingController.getOccupiedTimes);

module.exports = router;