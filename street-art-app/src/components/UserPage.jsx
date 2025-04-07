
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography } from '@mui/material'; // Dodano komponenty MUI do stylizacji
// FIX: problem z domyślną ikoną
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const UserPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser({ userName: 'testowy user', userData: ['art1', 'art2'] });
  }, []);

   function ButtonAppBar() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              StreetArtFinder
            </Typography>
            <Button  onClick={handleLogout} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  const handleLogout = async () => {
    navigate('/login');
  };

  const handleAdd = () => {
    navigate('/add-art');
  };
  
  

  if (!user) {
    return <div className="p-4">Loading user data...</div>;
  }

  return (
    <div>
     <ButtonAppBar/>
    <div  className="container conybg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen  text-white">
      <div className="max-w-4xl mx-auto p-6">
        
        <div>
          <h1 className="greeting text-3xl font-semibold tracking-wide">Hello, {user.userName}</h1>
         
        </div>

      
        <h2 className="text-2xl font-semibold mb-6">Your Arts</h2>

      
      

        {user.userData.length === 0 ? (
          <p className="text-center text-lg">You didn't add anything yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {user.userData.map((art, index) => (
              <Card sx={{width:500, justifyContent:'center'}} key={index} className="rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                <CardContent>
                  <Typography variant="h6" className="text-center mb-2">{art}</Typography>
                  <Typography variant="body2" className="text-gray-300 text-sm">
                    Description
                  </Typography>
                </CardContent>
              </Card>
              
            ))}
              <div className="mb-8 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            className="px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Add New
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            className="px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            See map
          </Button>

        </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserPage;
