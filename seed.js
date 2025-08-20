const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Court = require('./src/models/Court');
const connectDB = require('./src/config/db');

dotenv.config();

const courts = [
    {
        name: 'Academia Río 3',
        address: 'Bv. 9 de Julio 123, Río Tercero',
        image: '/images/ides.jpg',
        cost: 3000,
        duration: 90
    },
    {
        name: 'Vecinos Río 3',
        address: 'Calle Falsa 123, Río Tercero',
        image: '/images/vecinos.jpg',
        cost: 2500,
        duration: 90
    },
    {
        name: 'Hay Picado FC',
        address: 'Av. Libertador 456, Río Tercero',
        image: '/images/haypicado.jpg',
        cost: 2800,
        duration: 90
    },
    {
        name: 'Achique FC',
        address: 'San Martín 789, Río Tercero',
        image: '/images/achique.jpg',
        cost: 2700,
        duration: 90
    },
    // canchas de paddle
    {
        name: 'Padel Club RT',
        address: 'Belgrano 555, Río Tercero',
        image: '/images/padel_club.jpg',
        cost: 3500,
        duration: 60
    },
    {
        name: 'La Esquina Padel',
        address: 'Rivadavia 101, Río Tercero',
        image: '/images/la_esquina_padel.jpg',
        cost: 3200,
        duration: 60
    }
];

const seedDB = async () => {
    await connectDB();
    try {
        await Court.deleteMany({});
        await Court.insertMany(courts);
        console.log('Base de datos poblada con éxito.');
        mongoose.connection.close();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

seedDB();