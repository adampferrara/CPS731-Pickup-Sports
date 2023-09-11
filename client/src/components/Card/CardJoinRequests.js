import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red, green } from '@mui/material/colors';
import { useDispatch } from 'react-redux';
import { deleteRequest, updateRequestStatus } from '../../redux/actions/request';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';


const CardJoinRequests = ({ userProfile, request, reviewJoinGameRequest }) => {
  const dispatch = useDispatch();

  const onDeleteRequest = () => {
    dispatch(deleteRequest(request._id));
  };

  const onRequestClick = (status) => {
    const requestInfo = {
      _id: request._id,
      game: request.game,
      user: request.user,
      status
    };
    dispatch(updateRequestStatus(requestInfo)).then(
      data => {
        // If game hits max, show error message
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

  // If host is reviewing the request, show a compact request UI
  if (reviewJoinGameRequest) {
    return (
      <Card sx={{ maxWidth: 345, maxHeight: 90 }}>
        <CardActions disableSpacing>
          <CardContent>
            <Typography variant="body2" color="text">{request.user_info[0].firstName + " " + request.user_info[0].lastName}</Typography>
          </CardContent>
          <IconButton aria-label="Accept" onClick={() => onRequestClick("Accepted")} style={{ color: green[500], marginLeft: 'auto' }}>
            <CheckIcon />
          </IconButton>
          <IconButton aria-label="Reject" onClick={() => onRequestClick("Rejected")} style={{ color: red[500] }}>
            <ClearIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: green[300] }} variant="rounded">
            {userProfile.result.firstName.charAt(0)}
          </Avatar>
        }
        title="Join Game Request"
        subheader={"Status: " + request.status}
      />
      <CardContent className="null">
        <Typography variant="body2" color="text">
          Sports:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {request.game_info.sports_type}
        </Typography>

        <Typography variant="body2" color="text">
          Address:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {request.game_info.address}
        </Typography>

        <Typography variant="body2" color="text">
          Start Time:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(request.game_info.start_time)}
        </Typography>

        <Typography variant="body2" color="text">
          End Time:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(request.game_info.end_time)}
        </Typography>

        <Typography variant="body2" color="text">
          Host:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {request.host_info[0].firstName + " " + request.host_info[0].lastName}
        </Typography>
      </CardContent>
      <button type="button" className="btn btn-sm btn-danger delete_request" onClick={onDeleteRequest}>Delete Request</button>

    </Card>
  );
};

export default CardJoinRequests;
