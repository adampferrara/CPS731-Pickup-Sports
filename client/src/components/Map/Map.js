import React from 'react';
import GoogleMapReact from 'google-map-react';
import mapStyleLight from '../../Styles/GoogleMapStylesLight.json';
import mapStyleDark from '../../Styles/GoogleMapStylesDark.json';
import { useSelector } from "react-redux";
import Marker from '../Marker/Marker';
import { useLocation } from 'react-router-dom';
import NewHostedGameCard from "../Card/NewHostedGameCard";

export default function Map(centerCoords) {
  // Data from Redux
  const location = useLocation();
  const themeReducer = useSelector(({ theme }) => theme);
  const allGames = useSelector((state) => {
    switch (location.pathname) {
      case "/map":
        return state.games[1];
      case "/game_hosted":
        return state.games[0];
      case "/game_requests":
        return state.request[0]?.map((request, index) => request.game_info);
      case "/game_joined":
        return state.joinedGames[0]?.map((joinedGame, index) => joinedGame.game_info[0]);
      default:
        return [];
    }

  });


  // Map Configuration
  const defaultProps = {
    center: {
      lat: 43.653225,
      lng: -79.383186
    },
    zoom: 11
  };

  // Map Styling
  const mapOptions = {
    styles: themeReducer.theme ? mapStyleDark : mapStyleLight,
    disableDefaultUI: true
  };

  return (
    <div style={{ height: '100vh', width: '100%' }} className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAd-Es7DKwnvXUX8JPRpOyVKY1I_SRbcW4" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        options={mapOptions}
        center={{ lat: centerCoords.centerCoords[1], lng: centerCoords.centerCoords[0] }}
        yesIWantToUseGoogleMapApiInternals>
        {
          allGames && allGames.map((game, index) => (
            <Marker lat={game.coord[0]} lng={game.coord[1]} key={index} text={'Test'} />
          ))
        }
      </GoogleMapReact>
      {
        location.pathname === "/game_hosted" && (
          <NewHostedGameCard />
        )
      }

    </div>
  );
}