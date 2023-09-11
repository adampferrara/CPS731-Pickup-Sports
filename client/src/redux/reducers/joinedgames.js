const joinedGamesReducer = (joinedGames = [], action) => {
    switch (action.type) {
        case "FETCH_JOINED_GAMES":
            return [action.payload.data];
        default:
            return joinedGames;
    }
};

export default joinedGamesReducer;