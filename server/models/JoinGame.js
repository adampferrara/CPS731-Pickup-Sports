import mongoose from 'mongoose';

const JoinedGameSchema = mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const JoinedGame = mongoose.model('JoinedGame', JoinedGameSchema);

export default JoinedGame;