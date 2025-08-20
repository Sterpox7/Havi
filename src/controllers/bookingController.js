const Booking = require('../models/Booking');
let io;

exports.setIO = (ioInstance) => {
    io = ioInstance;
};

exports.createBooking = async (req, res) => {
    const { court, date, time, paymentAmount, paymentStatus } = req.body;
    try {
        const userId = req.user.id;
        
        const newBooking = new Booking({
            court,
            user: userId,
            date,
            time,
            paymentAmount,
            paymentStatus
        });
        await newBooking.save();

        if (io) {
            io.emit('new_booking_request', newBooking);
        } else {
            console.warn('Socket.IO no está disponible, no se enviará la notificación.');
        }

        res.status(201).json({ msg: 'Reserva creada con éxito. Esperando la confirmación de pago.' });
    } catch (err) {
        console.error('Error al crear reserva:', err.message);
        res.status(500).json({ msg: 'Error del servidor al crear reserva.' });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'username').populate('court', 'name');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

exports.getPendingBookings = async (req, res) => {
    try {
        const pendingBookings = await Booking.find({ paymentStatus: 'pending' }).populate('user', 'username').populate('court', 'name');
        res.json(pendingBookings);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener reservas pendientes.' });
    }
};

exports.acceptBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Reserva no encontrada.' });
        }
        booking.paymentStatus = 'accepted';
        await booking.save();
        res.json({ msg: 'Reserva aceptada con éxito.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al aceptar reserva.' });
    }
};

exports.denyBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Reserva denegada y eliminada con éxito.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al denegar reserva.' });
    }
};

exports.getOccupiedTimes = async (req, res) => {
    const { courtId, date } = req.query;
    try {
        const occupiedBookings = await Booking.find({ court: courtId, date: date, paymentStatus: 'accepted' });
        res.json(occupiedBookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};