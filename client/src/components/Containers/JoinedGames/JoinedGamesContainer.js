import React, { useEffect, useState } from 'react';
import './JoinedGamesContainer.css';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { TokenValidation } from '../../../util/TokenValidation';
import { IconButton } from '@mui/material';
import { BiRefresh } from 'react-icons/bi';
import { getJoinedGames } from '../../../redux/actions/games';
import HostedGameCard from '../../Card/HostedGameCard';

const JoinedGamesContainer = ({ menuStatus }) => {
    const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('profile')));

    const themeReducer = useSelector(({ theme }) => theme);
    const joinedGames = useSelector((state) => state.joinedGames[0]);
    const dispatch = useDispatch();

    useEffect(() => {
        const isTokenValid = TokenValidation(JSON.parse(localStorage.getItem('profile')));

        if (!isTokenValid) {
            dispatch({ type: "LOGOUT" });
        }
        else {
            setUserProfile(JSON.parse(localStorage.getItem('profile')));
        }
    }, [dispatch]);

    const refreshJoinedGames = () => {
        dispatch(getJoinedGames());
    };


    return (
        <div className={`pageContainer ${themeReducer.theme ? 'darkTheme' : 'lightTheme'} ${menuStatus ? 'menuClosed' : 'menuOpened'}`} >
            <div className="page-header">
                <h6>Joined Games</h6>
                <IconButton style={{ fontSize: 30 }} onClick={refreshJoinedGames}>
                    <BiRefresh />
                </IconButton>
            </div>
            <div className="cardList">
                {
                    joinedGames && joinedGames.map((game, _) => (
                        <HostedGameCard
                            game={game.game_info[0]}
                            key={game.game}
                            userProfile={userProfile.result}
                            onMapPage={false}
                            joinedGameId={game._id}
                            isJoinedGameCard={true} />
                    ))
                }
            </div>
        </div>

    );
};

export default JoinedGamesContainer;