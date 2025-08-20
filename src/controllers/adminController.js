const Booking = require('../models/Booking');
const User = require('../models/User');

exports.getPendingRequests = async (req, res) => {
    try {
        const pendingBookings = await Booking.find({ status: 'pending' }).populate('user court');
        const pendingOwners = await User.find({ role: 'owner', isApproved: false });

        res.json({ pendingBookings, pendingOwners });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.approveBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });
        res.status(200).json({ msg: 'Reserva aprobada con éxito.', booking });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.approveOwner = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const owner = await User.findByIdAndUpdate(ownerId, { isApproved: true });
        res.status(200).json({ msg: 'Dueño de cancha aprobado con éxito.', owner });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};