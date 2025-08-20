const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        user = new User({
            username,
            password,
            role: role || 'client',
            status: 'pending'
        });
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ msg: 'Registro exitoso. Esperando aprobación del administrador.', token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        if (user.status === 'pending') {
            return res.status(403).json({ msg: 'Tu cuenta está pendiente de aprobación por el administrador.' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' }).select('-password');
        res.json(pendingUsers);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener usuarios pendientes.' });
    }
};

exports.acceptUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }
        user.status = 'active';
        await user.save();
        res.json({ msg: 'Usuario aceptado con éxito.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al aceptar usuario.' });
    }
};

exports.denyUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Usuario denegado y eliminado con éxito.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al denegar usuario.' });
    }
};

exports.updatePhoneNumber = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const userId = req.user.id;
        await User.findByIdAndUpdate(userId, { phoneNumber });
        res.status(200).json({ msg: 'Número de teléfono actualizado con éxito.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};