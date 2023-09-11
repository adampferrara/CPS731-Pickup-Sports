import React, { useEffect, useState } from 'react';
import './HostedGamesContainer.css';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { TokenValidation } from '../../../util/TokenValidation';
import HostedGameCard from '../../Card/HostedGameCard';
import { BiRefresh } from 'react-icons/bi';
import { IconButton } from '@mui/material';
import { getHostedGames } from '../../../redux/actions/games';

const HostedGamesContainer = ({ menuStatus }) => {
    const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('profile')));

    const dispatch = useDispatch();
    const themeReducer = useSelector(({ theme }) => theme);
    const hostedGames = useSelector((state) => state.games[0]);

    useEffect(() => {
        const isTokenValid = TokenValidation(JSON.parse(localStorage.getItem('profile')));

        if (!isTokenValid) {
            dispatch({ type: "LOGOUT" });
        }
        else {
            setUserProfile(JSON.parse(localStorage.getItem('profile')));
        }

    }, [dispatch]);

    const refreshGames = () => {
        dispatch(getHostedGames());
    };

    return (
        <div className={`pageContainer ${themeReducer.theme ? 'darkTheme' : 'lightTheme'} ${menuStatus ? 'menuClosed' : 'menuOpened'}`} >
            <div className="page-header">
                <h6>Hosted Games</h6>
                <IconButton style={{ fontSize: 30 }} onClick={refreshGames}>
                    <BiRefresh />
                </IconButton>
            </div>
            <div className="cardList">
                {
                    hostedGames && hostedGames.map((game, _) => (
                        <HostedGameCard
                            game={game}
                            key={game._id}
                            userProfile={userProfile.result}
                            onMapPage={false} />
                    ))
                }
            </div>
        </div>

    );
};

export default HostedGamesContainer;