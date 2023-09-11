import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

import './MapContainer.css';
import SearchBar from '../../SearchBox/SearchBox';
import HostedGameCard from '../../Card/HostedGameCard';
import { TokenValidation } from '../../../util/TokenValidation';
import { useDispatch } from "react-redux";
import DialogSelect from '../../Filters/FilterBox';

const MapContainer = ({ menuStatus, setCenterCoords }) => {
    const [message, setMessage] = useState("");
    const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('profile')));
    const [filter, setfilter] = useState({});

    const dispatch = useDispatch();

    const themeReducer = useSelector(({ theme }) => theme);
    const nearbyGames = useSelector((state) => state.games[1]);
    const joinedGameRequests = useSelector((state) => {
        const requestIds = [];
        const requests = state.request[0];

        if (requests) {
            for (var i = 0; i < requests.length; i++)
                requestIds.push(requests[i].game);
        }

        return requestIds;
    });

    const joinedGame = useSelector((state) => {
        const gameIds = [];
        const games = state.joinedGames[0];

        if (games) {
            for (var i = 0; i < games.length; i++)
                gameIds.push(games[i].game);
        }

        return gameIds;
    });

    useEffect(() => {
        const isTokenValid = TokenValidation(JSON.parse(localStorage.getItem('profile')));

        if (!isTokenValid) {
            dispatch({ type: "LOGOUT" });
        }
        else {
            setUserProfile(JSON.parse(localStorage.getItem('profile')));
        }

    }, [dispatch]);

    return (
        <div className={`pageContainer ${themeReducer.theme ? 'darkTheme' : 'lightTheme'} ${menuStatus ? 'menuClosed' : 'menuOpened'}`} >
            <SearchBar setCenterCoords={setCenterCoords} filter={filter} setfilter={setfilter} />
            {
                message ?
                    (
                        <div className={`alert alert-danger alert-dismissible fade show`} role="alert">
                            <strong>{message}</strong>
                            <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
                        </div>
                    ) : null
            }
            <DialogSelect setfilter={setfilter} filter={filter} />

            <div className="cardList">
                {
                    nearbyGames && nearbyGames.map((game, index) => (

                        < HostedGameCard
                            key={index}
                            game={game}
                            userProfile={userProfile.result}
                            userJoinGameRequest={joinedGameRequests}
                            joinedGame={joinedGame}
                            setMessage={setMessage}
                            onMapPage={true} />
                    ))
                }
            </div>

            {
                (!nearbyGames || nearbyGames.length == 0) && (
                    <>
                        <br /><br /><br /><br />
                        <p>No Games Found</p>
                    </>
                )
            }
        </div>

    );
};

export default MapContainer;