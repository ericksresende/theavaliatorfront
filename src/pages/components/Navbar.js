import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import logotipo from '../../assets/logotipo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem('token');

  const handleLogout = () => {
    // Remover todos os itens do sessionStorage
    sessionStorage.clear();

    // Redirecionar para a tela de login
    navigate("/");
  };

  if (isAuthenticated) {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#243856', color: 'white' }}>
        <Toolbar>
          <img src={logotipo} alt="Logo" style={{ height: '65px' }} />
          <Box sx={{ marginLeft: 'auto' }}>
            <Button color="inherit" style={{ fontSize: '12px' }} onClick={handleLogout}><ExitToAppIcon/>Encerrar Sessão</Button>
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
          <Button color="inherit"><ExitToAppIcon/></Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
