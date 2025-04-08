import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, CardMedia } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';

// FIX: domyślna ikona Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const UserPage = () => {
  const [user, setUser] = useState({ userName: 'testowy user' });
  const [arts, setArts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArts = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'arts'));
        const artsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setArts(artsList);
      } catch (err) {
        console.error('Error fetching arts:', err);
      }
    };

    fetchArts();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleAdd = () => {
    navigate('/add-art');
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              StreetArtFinder
            </Typography>
            <Button onClick={handleLogout} color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>

      <div className="container bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen text-white">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-semibold tracking-wide mb-4">Hello, {user.userName}</h1>
          <h2 className="text-2xl font-semibold mb-6">Your Arts</h2>

          {arts.length === 0 ? (
            <p className="text-center text-lg">You didn't add anything yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {arts.map((art) => (
                <Card
                  key={art.id}
                  sx={{ width: 300, cursor: 'pointer' }}
                  className="rounded-lg shadow-xl hover:shadow-2xl transition duration-300"
                  onClick={() => navigate(`/art/${art.id}`)}
                >
                  {art.imageUrl && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={art.imageUrl}
                      alt={art.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" className="text-center mb-2">{art.title}</Typography>
                    <Typography variant="body2" className="text-gray-300 text-sm">
                      Location: {art.location?.lat.toFixed(4)}, {art.location?.lng.toFixed(4)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Add New
            </Button>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              See map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
