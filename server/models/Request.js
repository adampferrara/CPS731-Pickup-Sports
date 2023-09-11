import mongoose from 'mongoose';

const requestSchema = mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

/*
    Status: Pending
    Status: Accepted
    Status: Rejected
*/

const Request = mongoose.model('Request', requestSchema);

export default Request;