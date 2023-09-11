const gamesReducer = (games = [], action) => {
    switch (action.type) {
        case "FETCH_HOSTED_GAMES":
            return [action.payload.data];
        case "FETCH_NEARBY_GAMES":
            return [games[0], action.payload.data];
        default:
            return games;
    }
};

export default gamesReducer;