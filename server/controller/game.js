import Game from '../models/Game.js';
import mongoose from 'mongoose';
import Request from '../models/Request.js';
import JoinedGame from '../models/JoinGame.js';

export const getHostedGames = async (req, res) => {
    const userId = req.userId;
    const ObjectId = mongoose.Types.ObjectId;

    try {
        // Gets hosted game with all the join game requests
        const games = await Game.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "host",
                    foreignField: "_id",
                    as: "host_info"
                }
            },
            {
                $lookup: {
                    from: "requests",
                    let: {
                        gameId: "$_id"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$game", "$$gameId"]
                                },
                                {
                                    $eq: ["$status", "Pending"]
                                }]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: {
                                requestUser: "$user"
                            },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$requestUser"]
                                    }
                                }
                            }],
                            as: "user_info"
                        }
                    }],
                    as: "join_requests"
                }
            },
            {
                $lookup: {
                    from: "joinedgames",
                    let: {
                        gameId: "$_id"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$game", "$$gameId"]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: {
                                joinedUser: "$user"
                            },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$joinedUser"]
                                    }
                                }
                            }],
                            as: "user_info"
                        }
                    }],
                    as: "joined_users"
                }
            },
            { $match: { host: ObjectId(userId) } },
            {
                $sort: {
                    'start_time': -1
                }
            }
        ]);


        return res.status(200).json(games);

    } catch (error) {
        return res.status(400).json({ message: "No Games" });
    }
};

export const getNearbyGames = async (req, res) => {
    const query = req.query;

    var date = new Date();

    var sport = query.sport;
    var distance = Math.abs((parseInt(query.distance)));
    var start = query.start === "today" ? date : new Date(query.start);
    var end = query.end ? new Date(query.end) : null;//could be null
    const lat = query.lat;
    const lng = query.lng;

    const aYearFromNow = new Date();
    try {
        const games = await Game.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "host",
                    foreignField: "_id",
                    as: "host_info"
                }
            },
            {
                $lookup: {
                    from: "joinedgames",
                    localField: "_id",
                    foreignField: "game",
                    as: "joined_users"
                }
            },
            {
                $sort: {
                    'start_time': -1
                }
            }
        ]);

        var result = [];
        const unit = "N";
        const lat1 = query.lat;
        const lon1 = query.lon;

        for (var i = 0; i < games.length; i++) {

            const lat2 = games[i].coord[0];
            const lon2 = games[i].coord[1];


            var radlat1 = Math.PI * lat / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lng - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;

            if (unit == "K") { dist = dist * 1.609344; }
            if (unit == "N") { dist = dist * 0.8684; }

            games[i]["distance"] = dist;
            result.push(games[i]);
        }

        result.sort((a, b) => a["distance"] - b["distance"]);
        result.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        result = result.filter(game => game["distance"] <= distance);
        result = result.filter(game => game.joined_users.length < game.max_players);


        result = result.filter(game => {
            const gameStart = new Date(game.start_time);
            const gameEnd = new Date(game.end_time);
            const sports_type = game.sports_type;

            if (query.end !== "null") {
                if (gameStart >= start && gameEnd <= end) {
                    if (sport !== "All" && sports_type === sport) {
                        return game;
                    }
                    else if (sport === "All") {
                        return game;
                    }
                }
            }
            else {
                if (gameStart >= start && gameEnd <= aYearFromNow) {
                    if (sport !== "All" && sports_type === sport) {
                        return game;
                    }
                    else if (sport === "All") {
                        return game;
                    }
                }
            }
        });

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({ message: "No Games" });
    }

};

export const getJoinedGames = async (req, res) => {
    const userId = req.userId;
    const ObjectId = mongoose.Types.ObjectId;

    try {
        const joinedGames = await JoinedGame.aggregate([
            { $match: { user: ObjectId(userId) } },
            {
                $lookup: {
                    from: "games",
                    let: {
                        gameId: "$game"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$gameId"]
                            }
                        },

                    },
                    {
                        $lookup: {
                            from: "users",
                            let: {
                                hostId: "$host"
                            },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$hostId"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    "_id": 1,
                                    "firstName": 1,
                                    "lastName": 1,
                                    "phone_no": 1
                                }
                            }],
                            as: "host_info"
                        }
                    },
                    {
                        $lookup: {
                            from: "joinedgames",
                            let: {
                                gameId: "$_id"
                            },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $eq: ["$game", "$$gameId"]
                                    }
                                }
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: {
                                        joinedUser: "$user"
                                    },
                                    pipeline: [{
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$joinedUser"]
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            "_id": 1,
                                            "firstName": 1,
                                            "lastName": 1
                                        }
                                    }],
                                    as: "user_info"
                                }
                            },
                            {
                                $project: {
                                    "_id": 1,
                                    "user_info": 1
                                }
                            }],
                            as: "joined_users"

                        }
                    }],
                    as: "game_info"
                }
            },
            {
                $sort: {
                    "game_info.start_time": -1
                }
            },

        ]);

        return res.status(200).json(joinedGames);

    } catch (error) {
        return res.status(400).json({ message: "No Joined Game" });
    }
};

// This can create or update game
export const hostGame = async (req, res) => {
    const gameParam = req.body;
    const newGame = new Game({ ...gameParam });

    try {

        if (!gameParam._id) {
            const game = await newGame.save();
            return res.status(201).json(game);
        }
        else {
            const oldGame = await Game.findOne({ _id: gameParam._id });

            for (const [key, value] of Object.entries(gameParam)) {
                if (key === "_id" || key === "host")
                    continue;
                oldGame[key] = value;
            }

            const updatedGame = await Game.findOneAndUpdate({ _id: gameParam._id }, oldGame, { new: true });

            return res.status(200).json({ result: updatedGame });
        }
    } catch (error) {
        return res.status(400).json({ message: "Error 1" });
    }
};

export const requestGame = async (req, res) => {
    const userId = req.userId;
    const gameInfo = req.body;

    /*
        Taking the gameinfo, create a request object
    */

    const newRequest = new Request({
        game: gameInfo.gameId,
        user: userId
    });

    try {
        const existingRequest = await Request.findOne({
            game: gameInfo.gameId,
            user: userId
        });

        if (!existingRequest) {
            const request = await newRequest.save();
            return res.status(201).json(request);
        }
        else {
            return res.status(404).json({ message: "Request already placed" });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error 1" });
    }
};

export const updateRequestStatus = async (req, res) => {
    const request = req.body;
    try {
        // Get game info
        const game = await Game.findOne({ _id: request.game });
        // Get all the joined player of a game
        const joinedPlayers = await JoinedGame.findOne({ game: request.game });

        const maxPlayerAllowed = game.max_players;

        if (maxPlayerAllowed <= 0 || joinedPlayers && joinedPlayers >= maxPlayerAllowed) {
            return res.status(404).json({ message: "Game has reached max capacity" });
        }

        if (request.status === "Accepted") {
            const joinedGame = new JoinedGame({
                game: request.game,
                user: request.user
            });

            await joinedGame.save();
        }
        else if (request.status === "Rejected") {
            await JoinedGame.deleteOne({
                game: request.game,
                user: request.user
            });
        }

        const updatedRequest = await Request.findOneAndUpdate({ _id: request._id }, request, { new: true });

        return res.status(200).json({ result: updatedRequest });

    } catch (error) {
        return res.status(400).json({ message: "UpdateRequest: Something went wrong" });

    }

};

export const deleteRequest = async (req, res) => {
    const id = req.params.requestId;

    try {
        const deleteRequest = await Request.deleteOne({ _id: id });
        return res.status(200).json({ message: "Deleted" });

    } catch (error) {
        return res.status(400).json({ message: "Error 1" });
    }
};

export const deleteGame = async (req, res) => {
    const gameId = req.params.gameId;

    try {
        await Request.deleteOne({ game: gameId });
        await JoinedGame.deleteOne({ game: gameId });
        await Game.deleteOne({ _id: gameId });

        return res.status(200).json({ message: "Deleted" });

    } catch (error) {
        return res.status(400).json({ message: "Error 1" });
    }
};


export const removePlayerFromGame = async (req, res) => {
    const joinedGameId = req.params.joinedGamed;
    try {
        const joinedGame = await JoinedGame.findOne({ _id: joinedGameId });
        const deletedJoinedGame = await JoinedGame.deleteOne({ _id: joinedGameId });
        await Request.findOneAndUpdate({ game: joinedGame.game, user: joinedGame.user }, { status: "No longer in Game" }, { new: true });
        return res.status(200).json({ message: "Deleted player from game" });

    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Error 1" });
    }
};


export const getPlayersJoinedGameRequests = async (req, res) => {
    const userId = req.userId;
    const ObjectId = mongoose.Types.ObjectId;
    try {
        const allRequests = await Request.aggregate([
            { $match: { user: ObjectId(userId) } },
            {
                $lookup: {
                    from: "games",
                    localField: "game",
                    foreignField: "_id",
                    as: "game_info"
                }
            },
            {
                $unwind: "$game_info"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "game_info.host",
                    foreignField: "_id",
                    as: "host_info"
                }
            },
            {
                $sort: {
                    'game_info.start_time': -1
                }
            }
        ]);
        return res.status(201).json(allRequests);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: "Cannot get requests" });
    }


};