import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { blue, red } from '@mui/material/colors';
import { useDispatch } from "react-redux";
import { placeJoinRequest } from '../../redux/actions/request';
import { Divider } from '@mui/material';
import {
  MdSportsBasketball,
  MdSportsBaseball,
  MdSportsCricket,
  MdSportsFootball,
  MdSportsHandball,
  MdSportsHockey,
  MdSportsTennis,
  MdSportsVolleyball,
  MdSportsSoccer,
  MdSports,
  MdPerson
} from "react-icons/md";
import "./styles.css";

const CardGame = ({ game, userProfile, joinedGameRequests, setMessage }) => {
  const dispatch = useDispatch();
  const showJoinButton = userProfile._id !== game.host;
  const [disableJoin, setdisableJoin] = useState(joinedGameRequests ? joinedGameRequests.includes(game._id) : false);

  const getSportsIcon = () => {
    switch (game.sports_type) {
      case "Basketball":
        return <MdSportsBasketball />;
      case "Baseball":
        return <MdSportsBaseball />;
      case "Cricket":
        return <MdSportsCricket />;
      case "Football":
        return <MdSportsFootball />;
      case "Handball":
        return <MdSportsHandball />;
      case "Hockey":
        return <MdSportsHockey />;
      case "Tennis":
        return <MdSportsTennis />;
      case "Volleyball":
        return <MdSportsVolleyball />;
      case "Soccer":
        return <MdSportsSoccer />;
      default:
        return <MdSports />;
    }
  };

  const onJoinGameClick = () => {
    dispatch(placeJoinRequest({ gameId: game._id })).then(
      (message) => {
        if (message[0]) {
          setdisableJoin(true);
        }
        setMessage(message);
      }
    );
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[300] }} aria-label="recipe" variant="rounded">
            {getSportsIcon()}
          </Avatar>
        }
        title={game.sports_type}
      />
      <Divider />
      <CardContent>
        <div className="row">
          <div className="column1">
            <p className="Type">Players:</p>
            <p className="Data">0/{game.max_players}</p>
            {
              showJoinButton && (<button type="button" className="btn btn-sm btn-outline-success" onClick={onJoinGameClick} disabled={disableJoin}>{disableJoin ? "Joined" : "Join"}</button>)
            }
          </div>
          <div className="column2">
            <p className="Type">Start Time:</p>
            <p className="Data">{game.start_time}</p>
            <p className="Type">Location:</p>
            <p className="Data">{game.address}</p>
          </div>
        </div>
      </CardContent>
      <Divider />
      <CardContent className="null">
        <div className="hostData">
          <div className="column3">
            <p className="Data">Host Name: <br />{game.host_info[0].firstName}</p>
            <p className="Data">Host Contact: <br />{game.phone_no}</p>
            {
              game.distance && (
                <p className="Data">Distance: <br />{Math.round((game.distance) * 100) / 100}km</p>
              )
            }
          </div>
          <div className="column4">
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" variant="rounded">
              <MdPerson />
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardGame;
