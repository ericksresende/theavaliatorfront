import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem('token');

  if (isAuthenticated) {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#243856', color: 'white' }}>
        <Toolbar>
          <Typography variant="h6">The Avaliator</Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <Button color="inherit">Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  } else {
    navigate("/");
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#243856', color: 'white' }}>
      <Toolbar>
        <Typography variant="h6">The Avaliator</Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          <Button color="inherit">Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
