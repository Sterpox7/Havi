const Court = require('../models/Court');

exports.createCourt = async (req, res) => {

};

exports.getCourts = async (req, res) => {
    try {
        const courts = await Court.find();
        res.json(courts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.getCourtById = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (!court) {
            return res.status(404).json({ msg: 'Cancha no encontrada' });
        }
        res.json(court);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};