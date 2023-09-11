import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';

import Map from './components/Map/Map';
import Sidenav from './components/Sidenav/Sidenav';
import MapContainer from './components/Containers/Map/MapContainer';

import GameRequestsContainer from './components/Containers/GameRequests/GameRequestsContainer';
import HostedGamesContainer from './components/Containers/HostedGames/HostedGamesContainer';
import JoinedGamesContainer from './components/Containers/JoinedGames/JoinedGamesContainer';
import UserProfileContainer from './components/Containers/UserProfile/UserProfileContainer';
import { TokenValidation } from './util/TokenValidation';

import { getHostedGames, getJoinedGames } from './redux/actions/games';
import { getPlayersJoinedGameRequests } from './redux/actions/request';
import { useDispatch } from "react-redux";
import { Auth } from './components/Login/Auth';


export const App = () => {

  const [centerCoords, setCenterCoords] = useState([-79.383186, 43.653225]);
  const [isSignedIn, setisSignedIn] = useState(false);
  const [menuCollapse, setMenuCollapse] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const isTokenValid = TokenValidation(JSON.parse(localStorage.getItem('profile')));

    if (!isTokenValid) {
      dispatch({ type: "LOGOUT" });
      setisSignedIn(false);
    }
    else {
      setisSignedIn(true);
    }

  }, [dispatch]);

  useEffect(() => {
    if (isSignedIn) {
      dispatch(getHostedGames());
      dispatch(getPlayersJoinedGameRequests());
      dispatch(getJoinedGames());

    }
  }, [dispatch, isSignedIn]);

  return (
    <div className="App">
      {
        !isSignedIn ? (
          <Auth setisSignedIn={setisSignedIn} />
        ) :
          (
            <BrowserRouter>
              <Sidenav menuCollapse={menuCollapse} setMenuCollapse={setMenuCollapse} setisSignedIn={setisSignedIn} />
              <Routes>
                <Route path="/map" extact element={<MapContainer menuStatus={menuCollapse} setCenterCoords={setCenterCoords} />} />
              </Routes>
              <Routes>
                <Route path="/game_hosted" extact element={<HostedGamesContainer menuStatus={menuCollapse} />} />
              </Routes>
              <Routes>
                <Route path="/game_joined" extact element={<JoinedGamesContainer menuStatus={menuCollapse} />} />
              </Routes>
              <Routes>
                <Route path="/game_requests" extact element={<GameRequestsContainer menuStatus={menuCollapse} />} />
              </Routes>
              <Routes>
                <Route path="/user_profile" extact element={<UserProfileContainer menuStatus={menuCollapse} />} />
              </Routes>
              <Routes>
                <Route path="/" extact element={<MapContainer menuStatus={menuCollapse} setCenterCoords={setCenterCoords} />} />
              </Routes>
              <Map centerCoords={centerCoords} />
            </BrowserRouter>
          )
      }
    </div >
  );
};
