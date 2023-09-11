import * as api from '../../api';

export const getHostedGames = () => async (dispatch) => {
    try {
        const { data } = await api.fetchHostedGames();
        dispatch({ type: "FETCH_HOSTED_GAMES", payload: { data } });
    } catch (error) {
        console.error(error);
        const { data: { message } } = error.response;
        return message;
    }
};

export const getNearbyGames = (filters) => async (dispatch) => {
    try {
        var sport = null;
        var distance = null;
        var start = null;
        var end = null;
        const lat = filters.coords[0];
        const lng = filters.coords[1];

        // No filters selected
        if (!filters.sport) {
            sport = "All";
            distance = 5;
            start = "today";
        }
        // Filter entered
        else {
            sport = filters.sport;
            distance = filters.distance;
            start = filters.date[0].startDate;
            end = filters.date[0].endDate;
        }

        const { data } = await api.fetchNearbyGames(lat, lng, sport, distance, start, end);
        dispatch({ type: "FETCH_NEARBY_GAMES", payload: { data } });

    } catch (error) {
        console.error(error);
        const { data: { message } } = error.response;
        return message;
    }
};

export const getJoinedGames = () => async (dispatch) => {
    try {
        const { data } = await api.getJoinedGames();
        dispatch({ type: "FETCH_JOINED_GAMES", payload: { data } });
    } catch (error) {
        return error.response;
    }
};

export const hostGame = (game) => async (dispatch) => {
    try {
        await api.hostGame(game);

        dispatch(getHostedGames());
    } catch (error) {
        console.error(error);
        const { data: { message } } = error.response;
        return message;
    }
};

export const deleteGame = (gameId) => async (dispatch) => {
    try {
        await api.deleteGame(gameId);

        dispatch(getHostedGames());
    } catch (error) {
        const { data: { message } } = error.response;
        return message;
    }
};
