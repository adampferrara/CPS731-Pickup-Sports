import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DateFilter from './DateFilter';
import { FormHelperText, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getNearbyGames } from '../../redux/actions/games';


export default function DialogSelect({ filter, setfilter }) {
  const [open, setOpen] = useState(false);
  const [sport, setSport] = useState("");
  const [distance, setdistance] = useState(5);
  const [hasError, sethasError] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      key: 'selection',
      endDate: null
    }
  ]);
  const dispatch = useDispatch();


  const handleChange = (event) => {
    setSport((event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleSubmit = () => {

    if (sport.length === 0) {
      sethasError(true);
    }
    else {

      filter.sport = sport;
      filter.distance = distance;
      filter.date = state;

      setfilter(filter);

      if (filter.coords) {
        dispatch(getNearbyGames(filter));
      }

      handleClose();
    }
  };

  const handleDistanceChange = (event) => {
    setdistance(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Filters</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill the form</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }} required error={hasError}>
              <InputLabel id="demo-dialog-select-label">Sport</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={sport}
                onChange={handleChange}
                input={<OutlinedInput label="Sport" />}>

                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={"Basketball"}>Basketball</MenuItem>
                <MenuItem value={"Baseball"}>Baseball</MenuItem>
                <MenuItem value={"Cricket"}>Cricket</MenuItem>
                <MenuItem value={"Football"}>Football</MenuItem>
                <MenuItem value={"Handball"}>Handball</MenuItem>
                <MenuItem value={"Hockey"}>Hockey</MenuItem>
                <MenuItem value={"Tennis"}>Tennis</MenuItem>
                <MenuItem value={"Volleyball"}>Volleyball</MenuItem>
                <MenuItem value={"Soccer"}>Soccer</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
              {
                hasError && (
                  <FormHelperText>Required</FormHelperText>
                )
              }
            </FormControl>
            <Box
              className="inputContainer"
              sx={{
                width: "10%",
                flex: "0 0 50%",
                padding: "10px",
              }}
            >
              <TextField
                type="number"
                label="Distance Range (km)"
                sx={{ width: "100%" }}
                value={distance}
                onChange={handleDistanceChange}
              />
              <FormHelperText>Distance must be greater than 0</FormHelperText>
            </Box>
            <DateFilter state={state} setState={setState} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}