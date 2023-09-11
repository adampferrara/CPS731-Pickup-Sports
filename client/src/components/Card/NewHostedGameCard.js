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
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TimePicker from "@mui/lab/TimePicker";
import SearchBar from "../SearchBox/SearchBox";
import { FormHelperText } from "@mui/material";
import { useDispatch } from 'react-redux';
import { TokenValidation } from "../../util/TokenValidation";
import { hostGame } from "../../redux/actions/games";

export default function NewHostedGameCard() {
  const [open, setOpen] = useState(false);
  const [hasError, sethasError] = useState(false);
  const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('profile')));

  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  // Needed info
  const [today, settoday] = useState(new Date());
  const [sport, setSport] = useState("");
  const [date, setDate] = useState(today); // Dec 10
  const [startTime, setStartTime] = useState(today); // Dec 4
  const [endTime, setEndTime] = useState(today);
  const [maxPlayers, setmaxPlayers] = useState(0);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState([]);
  const [description, setdescription] = useState("");

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
    clear();
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
      clear();
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleMaxPlayers = (event) => {
    setmaxPlayers(event.target.value);
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

  const clear = () => {
    sethasError(false);
    settoday(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setmaxPlayers(0);
    setAddress('');
    setCoords([]);
    setdescription('');
    setSport("");
  };

  const handleSubmit = () => {
    if (sport.length && date && startTime && endTime && maxPlayers > 0 && address) {
      sethasError(false);
      setOpen(false);

      const game = {
        host: userProfile.result._id,
        address,
        coord: [coords[1], coords[0]],
        start_time: startTime,
        end_time: endTime,
        description,
        sports_type: sport,
        max_players: maxPlayers
      };

      dispatch(hostGame(game));
    }
    else {
      sethasError(true);
    }
  };

  return (
    <div>
      {/* <Button onClick={handleClickOpen}>Filters</Button> */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Create a New Game</DialogTitle>
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
                sx={{ width: "100%" }}
                onChange={handleMaxPlayers}
              />
              <FormHelperText>Max Player must be greater than 0</FormHelperText>
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
              <SearchBar isUsingMap={false} setAddress={setAddress} setCoords={setCoords} placeholder="Enter Location of Game" />
            </Box>
            {hasError && <FormHelperText>Please complete all fields</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
