import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import SearchBar from "../SearchBox/SearchBox";
import { FormHelperText } from "@mui/material";
import { useDispatch } from 'react-redux';
import { TokenValidation } from "../../util/TokenValidation";
import { deleteGame, hostGame } from "../../redux/actions/games";
import EditIcon from '@mui/icons-material/Edit';


export default function EditHostedGameCard({ game }) {
  const [open, setOpen] = useState(false);
  const [hasError, sethasError] = useState(false);
  const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('profile')));

  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  // Needed info
  const [today, settoday] = useState(new Date());
  const [sport, setSport] = useState(game.sports_type);
  const [date, setDate] = useState(new Date(game.start_time));
  const [startTime, setStartTime] = useState(new Date(game.start_time));
  const [endTime, setEndTime] = useState(new Date(game.end_time));
  const [maxPlayers, setmaxPlayers] = useState(game.maxPlayers);
  const [playerError, setPlayerError] = useState(false);
  const [address, setAddress] = useState(game.address);
  const [coords, setCoords] = useState(game.coord);
  const [description, setdescription] = useState(game.description);

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

  const handleChange = (event) => {
    setSport(event.target.value || "");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);

    const updateDateStart = startTime;
    updateDateStart.setDate(newDate.getDate());
    updateDateStart.setMonth(newDate.getMonth());
    updateDateStart.setYear(newDate.getFullYear());
    setStartTime(updateDateStart);

    const updateDateEnd = endTime;
    updateDateEnd.setDate(newDate.getDate());
    updateDateEnd.setMonth(newDate.getMonth());
    updateDateEnd.setYear(newDate.getFullYear());
    setEndTime(updateDateEnd);
  };

  const handleMaxPlayers = (event) => {
    var newMax = event.target.value;
    if (newMax < game.joined_users.length) {
      setPlayerError(true);
      setmaxPlayers(maxPlayers);
    }
    else {
      setmaxPlayers(event.target.value);
      setPlayerError(false);
    }

  };

  const handleDescriptionChange = (event) => {
    setdescription(event.target.value);
  };

  const handleStartTimeChange = (newStartTime) => {
    const updateDate = newStartTime;
    updateDate.setDate(date.getDate());
    setStartTime(updateDate);
  };

  const handleEndTimeChange = (newEndTime) => {
    const updateDate = newEndTime;
    updateDate.setDate(date.getDate());
    setEndTime(updateDate);
  };

  const handleSubmit = () => {
    var newMax = maxPlayers;
    if (!maxPlayers) newMax = game.max_players;

    if (sport.length && date && startTime && endTime && newMax > 0 && address) {
      sethasError(false);
      setOpen(false);

      const editGame = {
        _id: game._id,
        host: userProfile.result._id,
        address,
        coord: [coords[1], coords[0]],
        start_time: startTime,
        end_time: endTime,
        description,
        sports_type: sport,
        max_players: maxPlayers
      };

      dispatch(hostGame(editGame));
    }
    else {
      sethasError(true);
    }
  };

  const handleDelete = () => {
    dispatch(deleteGame(game._id)).then(
      (data) => {
        setOpen(false);
      });
  };

  return (
    <div>
      <IconButton
        color="primary"
        aria-label="add"
        size="small"
        disableRipple="true"
        onClick={handleClickOpen}
      >
        <EditIcon />
      </IconButton >
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Edit a Game</DialogTitle>
        <DialogContent>
          <FormControl
            sx={{
              m: 1,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              paddingRight: "20px",
            }}
            error={hasError}
          >
            <Box
              className="inputContainer"
              sx={{
                width: "100%",
                flex: "0 0 50%",
                paddingRight: "10px",
              }}
            >
              <InputLabel id="demo-dialog-select-label">Sport</InputLabel>
              <Select
                label="Sport"
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={sport}
                onChange={handleChange}
                input={<OutlinedInput label="Sport" />}
                sx={{ width: "inherit" }}
              >
                <MenuItem value="Other">
                  <em>Other</em>
                </MenuItem>
                <MenuItem value={"Basketball"}>Basketball</MenuItem>
                <MenuItem value={"Baseball"}>Baseball</MenuItem>
                <MenuItem value={"Cricket"}>Cricket</MenuItem>
                <MenuItem value={"Football"}>Football</MenuItem>
                <MenuItem value={"Handball"}>Handball</MenuItem>
                <MenuItem value={"Hockey"}>Hockey</MenuItem>
                <MenuItem value={"Tennis"}>Tennis</MenuItem>
                <MenuItem value={"Volleyball"}>Volleyball</MenuItem>
                <MenuItem value={"Soccer"}>Soccer</MenuItem>
              </Select>
            </Box>
            <Box
              className="inputContainer"
              sx={{
                width: "100%",
                flex: "0 0 50%",
                paddingLeft: "10px",
              }}
            >
              <TextField
                type="number"
                label="Max # of Players"
                defaultValue={game.max_players}
                sx={{ width: "100%" }}
                onChange={handleMaxPlayers}
              />
              {playerError && <FormHelperText>Max Player count must be more than the amount of players already joined</FormHelperText>}
            </Box>
            <Box
              className="inputContainer"
              sx={{
                width: "100%",
                flex: "0 0 45%",
                paddingRight: "10px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  inputFormat="MM/dd/yyyy"
                  value={date}
                  minDate={new Date()}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField sx={{ width: "100%" }} {...params} />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box
              className="inputContainer"
              sx={{
                width: "100%",
                flex: "0 0 27.5%",
                paddingLeft: "10px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  minTime={
                    date.toDateString() === today.toDateString()
                      ? now
                      : new Date(0, 0, 0, 0)
                  }
                  onChange={handleStartTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Box
              className="inputContainer"
              sx={{
                width: "100%",
                flex: "0 0 27.5%",
                paddingLeft: "10px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={endTime}
                  minTime={startTime}
                  onChange={handleEndTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Box
              className="inputContainer"
              sx={{
                width: "100%",
                flex: "0 0 100%",
              }}
            >
              {/* <TextField
                id="outlined-multiline-static"
                label="Address of Game"
                fullWidth
                placeholder="Enter an address for the game"
              /> */}
              <SearchBar isUsingMap={false} setAddress={setAddress} setCoords={setCoords} defaultAddress={address} placeholder="Enter New Location" />
            </Box>
            {hasError && <FormHelperText>Please complete all fields</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>

        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  );
}
