import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';

import gameRoutes from './routes/game.js';

const app = express();
dotenv.config();

//Preconfig Express App
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//Middleware
app.use('/game', gameRoutes);
app.use('/user', userRoutes); //Authentication

// Home Route
app.get('/', (req, res) => {
    res.send('*** Pickup Sports API ***');
});

// Connect to DB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
        if (error) {
            console.error(error);
        }
        else {
            app.listen(PORT, () => console.log('Successfully Connected to MongoDB\nServer running on port ' + PORT));
        }
    });