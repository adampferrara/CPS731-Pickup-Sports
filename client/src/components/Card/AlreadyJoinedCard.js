import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "./cardgame.css";

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { removePlayerFromGame } from '../../redux/actions/request';

const AlreadyJoinedCard = ({ joinedUser, isJoinedGameCard = false }) => {
  const dispatch = useDispatch();

  const removePlayer = () => {
    dispatch(removePlayerFromGame(joinedUser._id));
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActions disableSpacing>
        <CardContent>
          <Typography variant="body2">{joinedUser.user_info[0].firstName + " " + joinedUser.user_info[0].lastName}</Typography>
        </CardContent>
        {
          !isJoinedGameCard && (
            <Button aria-label="Accept" style={{ marginLeft: 'auto' }} color={"error"} onClick={removePlayer}>
              Remove
            </Button>
          )
        }

      </CardActions>
    </Card>
  );
};

export default AlreadyJoinedCard;