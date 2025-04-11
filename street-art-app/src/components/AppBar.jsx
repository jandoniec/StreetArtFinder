import { AppBar,Toolbar, Button,  Typography } from '@mui/material';
import React from 'react';

import { useNavigate } from 'react-router-dom';

const AppBarComponent=()=>{
    const navigate=useNavigate()
    const handleLogout = () => {
        navigate('/');
      };


    return (
        <AppBar position="static">
          <Toolbar>
          
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              StreetArtFinder
            </Typography>
            <Button onClick={handleLogout} sx={{fontSize:25}} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
    )

}
export default AppBarComponent
