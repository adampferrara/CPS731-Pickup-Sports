import React, { useEffect, useState } from 'react';
import './GameRequestsContainer.css';
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { TokenValidation } from '../../../util/TokenValidation';
import CardJoinRequests from '../../Card/CardJoinRequests';
import { getPlayersJoinedGameRequests } from '../../../redux/actions/request';
import { IconButton } from '@mui/material';
import { BiRefresh } from 'react-icons/bi';
const GameRequestsContainer = ({ menuStatus }) => {
    const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const themeReducer = useSelector(({ theme }) => theme);
    const joinedGameRequests = useSelector((state) => state.request[0]);


    useEffect(() => {
        const isTokenValid = TokenValidation(JSON.parse(localStorage.getItem('profile')));

        if (!isTokenValid) {
            dispatch({ type: "LOGOUT" });
        }
        else {
            setUserProfile(JSON.parse(localStorage.getItem('profile')));
        }

        dispatch(getPlayersJoinedGameRequests());

    }, [dispatch]);

    const refreshJoinRequest = () => {
        dispatch(getPlayersJoinedGameRequests());
    };

    return (
        <div className={`pageContainer ${themeReducer.theme ? 'darkTheme' : 'lightTheme'} ${menuStatus ? 'menuClosed' : 'menuOpened'}`} >
            <div className="page-header">
                <h6>Join Game Requests</h6>
                <IconButton style={{ fontSize: 30 }} onClick={refreshJoinRequest}>
                    <BiRefresh />
                </IconButton>
            </div>
            <div className="cardList">
                {
                    joinedGameRequests && joinedGameRequests.map((request, index) => (
                        <CardJoinRequests
                            userProfile={userProfile}
                            request={request}
                            reviewJoinGameRequest={false}
                            key={index} />
                    ))
                }
            </div>
        </div>

    );
};

export default GameRequestsContainer;