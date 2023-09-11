import * as api from '../../api';
import { getHostedGames } from './games';

export const placeJoinRequest = (gameId) => async () => {
    try {
        await api.placeJoinRequest(gameId);

        return [true, "Request placed"];
        // dispatch({ type: "JOIN_REQUESTS", payload: { data } });
    } catch (error) {
        return [false, "Request already placed"];
    }
};

export const deleteRequest = (requestId) => async (dispatch) => {
    try {
        await api.deleteJoinRequest(requestId);

        dispatch(getPlayersJoinedGameRequests());
    } catch (error) {
        return error;
    }
};

export const updateRequestStatus = (requestInfo) => async (dispatch) => {
    try {
        const { data } = await api.updateRequestStatus(requestInfo);

        dispatch(getHostedGames());

    } catch (error) {
        return error;
    }
};


export const getPlayersJoinedGameRequests = () => async (dispatch) => {
    try {
        const { data } = await api.getPlayersJoinedGameRequests();

        dispatch({ type: "JOINED_GAME_REQUESTS", payload: { data } });
    } catch (error) {
        const { data: { message } } = error.response;
        return message;
    }
};

export const removePlayerFromGame = (joinedGameId) => async (dispatch) => {
    try {
        await api.removePlayerFromGame(joinedGameId);

        dispatch(getHostedGames());

    } catch (error) {
        return error;
    }
};

