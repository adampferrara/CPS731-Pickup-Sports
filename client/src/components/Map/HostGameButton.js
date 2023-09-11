import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function HostGameButton() {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab color="primary" aria-label="add" sx={{position: 'absolute', bottom: 16, right: 16}}>
        <AddIcon />
      </Fab>
    </Box>
  );
}