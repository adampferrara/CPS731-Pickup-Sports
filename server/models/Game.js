import mongoose from 'mongoose';
const gameSchema = mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    coord: {
        type: [Number],
        required: false
    },
    start_time: {
        type: Date,
        required: false
    },
    end_time: {
        type: Date,
        required: false
    },
    description: String,
    max_players: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    sports_type: {
        type: String,
        required: true
    }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;