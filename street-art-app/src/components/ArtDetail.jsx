import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography,AppBar,Toolbar ,Card, CardContent, CardMedia } from '@mui/material';
import { firestore } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppBarComponent from './AppBar';
const ArtDetail = () => {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchArtDetails = async () => {
      try {
        const artDoc = await getDoc(doc(firestore, 'arts', id));
        if (artDoc.exists()) {
          const artData = artDoc.data();
          setArt(artData);

         
        }
      } catch (error) {
        console.error('Error fetching art details:', error);
      }
    };

    fetchArtDetails();
  }, [id]);

  if (!art) return <div>Loading...</div>;
  return (
    <div>
      <AppBarComponent/>
    <Box sx={{ p: 4, maxWidth: '100%' }}>
      <Typography variant="h5" style={{ textAlign: 'center' }}>{art.title}</Typography>
      {art.location.lat && art.location.lng && (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center', 
      marginTop: '30px',
    }}
  >
    <MapContainer
      center={[art.location.lat, art.location.lng]}
      zoom={13}
      style={{ width: '1200px', height: '800px', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[art.location.lat, art.location.lng]}>
        <Popup>{art.title}</Popup>
        </Marker>
    </MapContainer>
  </Box>
)}
</Box>
</div>
  );
};

export default ArtDetail;
