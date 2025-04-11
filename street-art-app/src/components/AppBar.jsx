import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import React from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const AppBarComponent=()=>{
    const navigate=useNavigate()
    const handleLogout = () => {
        navigate('/');
      };


    return (
        <AppBar position="static">
          <Toolbar>
          
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              StreetArtFinder
            </Typography>
            
            <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
            
            {/* <Button onClick={handleLogout} sx={{fontSize:25}} color="inherit">Logout</Button> */}
          </Toolbar>
        </AppBar>
    )

}
export default AppBarComponent
