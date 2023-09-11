import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import { useDispatch } from "react-redux";
import { placeJoinRequest, removePlayerFromGame } from '../../redux/actions/request';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardJoinRequests from './CardJoinRequests';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import AlreadyJoinedCard from './AlreadyJoinedCard';
import { Divider } from '@mui/material';
import EditHostedGameCard from './EditHostedGameCard';

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
  MdSports
} from "react-icons/md";
import "./cardgame.css";
import { getJoinedGames } from '../../redux/actions/games';



const HostedGameCard = ({ game, userProfile, userJoinGameRequest, joinedGameId, joinedGame, setMessage, onMapPage, isJoinedGameCard = false }) => {
  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const [expanded, setExpanded] = React.useState(false);
  const [expandedJoined, setExpandedJoined] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    setExpandedJoined(false);
  };

  const handleExpandJoinedClick = () => {
    setExpandedJoined(!expandedJoined);
    setExpanded(false);
  };

  const dispatch = useDispatch();
  // Dont show join button for user who hosted the game
  const showJoinButton = userProfile._id !== game.host;
  // Disbale join button if the user already placed a request
  const [disableJoin, setdisableJoin] = useState(userJoinGameRequest ? userJoinGameRequest.includes(game._id) : false);
  const [alreadyJoinedGame, setalreadyJoinedGame] = useState(joinedGame ? joinedGame.includes(game._id) : false);

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
      (error) => {
        setMessage(error);
        setdisableJoin(true);
      }
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var time = hours + ':' + minutes + ' ' + ampm;

    return date.toDateString() + " " + time;
  };

  const onLeaveGame = () => {
    dispatch(removePlayerFromGame(joinedGameId)).then(data => {
      dispatch(getJoinedGames());
    });
  };

  const distance = game.distance ? Math.round((game.distance) * 100) / 100 + "km" : "";

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[300] }} aria-label="recipe" variant="rounded">
            {getSportsIcon()}
          </Avatar>
        }
        action={
          !isJoinedGameCard && !onMapPage && (
            <IconButton aria-label="edit">
              <EditHostedGameCard game={game}/>
            </IconButton>
          )
        }
        title={game.sports_type}
        subheader={distance}
      >

      </CardHeader>
      <Divider />
      <CardContent className="GameReq">
        <div className="row">
          <div className="column1">
            <p className="Type">Players:</p>
            <p className="Data">{game.joined_users ? game.joined_users.length : 0}/{game.max_players}</p>
          </div>
          <div className="column2">
            <p className="Type">Start Time:</p>
            <p className="Data">{formatDate(game.start_time)}</p>
            <p className="Type">End Time:</p>
            <p className="Data">{formatDate(game.end_time)}</p>
            <p className="Type">Location:</p>
            <p className="Data">{game.address}</p>
          </div>
          <div className="column3">
            <p className="Data"><strong>Host: </strong>{game.host_info[0].firstName + " " + game.host_info[0].lastName}</p>
            <p className="Data"><strong>Phone no: </strong>{game.host_info[0].phone_no}</p>
          </div>
        </div>
      </CardContent>

      {
        showJoinButton && !isJoinedGameCard && (<button type="button" className={`btn btn-sm btn-join btn-${alreadyJoinedGame ? "warning" : "success"}`} onClick={onJoinGameClick} disabled={disableJoin || alreadyJoinedGame}>{!disableJoin && !alreadyJoinedGame ? "Place Join Request" : (alreadyJoinedGame ? "Already Joined" : "Request Placed")}</button>)
      }

      {
        !showJoinButton && onMapPage && !isJoinedGameCard && (<button type="button" className="btn btn-sm btn-info" disabled>Your Hosted Game</button>)
      }

      {
        isJoinedGameCard && (<button type="button" className="btn btn-sm btn-danger" onClick={onLeaveGame}>Leave Game</button>)
      }

      {
        !onMapPage && (
          <>
            {
              !isJoinedGameCard && (
                <>
                  <Divider />
                  <CardActions disableSpacing>
                    <Typography>
                      Player Requests ({game.join_requests ? game.join_requests.length : 0})
                    </Typography>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto">
                    {
                      game.join_requests && game.join_requests.map((request, index) => (
                        <CardJoinRequests request={request} reviewJoinGameRequest={true} key={index} />
                      ))
                    }
                  </Collapse>
                </>
              )
            }

            <Divider />
            <CardActions disableSpacing>
              <Typography>
                Joined Players  ({game.joined_users ? game.joined_users.length : 0})
              </Typography>
              <ExpandMore
                expand={expandedJoined}
                onClick={handleExpandJoinedClick}
                aria-expanded={expandedJoined}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expandedJoined} timeout="auto" unmountOnExit>
              {
                game.joined_users && game.joined_users.map((joinedUser, index) => (
                  <AlreadyJoinedCard joinedUser={joinedUser} isJoinedGameCard={isJoinedGameCard} key={index} />
                ))
              }
            </Collapse>
          </>
        )
      }

    </Card >
  );
};

export default HostedGameCard;
