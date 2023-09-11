const requestReducer = (requests = [], action) => {
    switch (action.type) {
        case "JOINED_GAME_REQUESTS":
            return [action.payload.data];
        default:
            return requests;
    }
};

export default requestReducer;