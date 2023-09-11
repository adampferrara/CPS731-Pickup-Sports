import express from 'express';
import {
    getHostedGames,
    getNearbyGames,
    hostGame,
    requestGame,
    deleteRequest,
    getPlayersJoinedGameRequests,
    updateRequestStatus,
    removePlayerFromGame,
    getJoinedGames,
    deleteGame
} from '../controller/game.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all the games (no filter)
router.get('/', auth, getHostedGames);
// Find nearby game given postal code
router.get('/nearby', auth, getNearbyGames);
// Host game (either create or update game)
router.patch('/host', auth, hostGame);
router.delete('/host/:gameId', auth, deleteGame);
// Place request or update request status (only host)
router.post('/request', auth, requestGame);
router.delete('/request/:requestId', auth, deleteRequest);

router.patch('/request/update', auth, updateRequestStatus);

//Get all requests
router.get('/joined_game_request', auth, getPlayersJoinedGameRequests);
router.delete('/joined_game/:joinedGamed', removePlayerFromGame);
router.get('/joined_game', auth, getJoinedGames);

export default router;