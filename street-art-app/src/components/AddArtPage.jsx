import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Container,
  Box
} from '@mui/material';
import { storage, firestore } from '../firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import {
  collection,
  addDoc
} from 'firebase/firestore';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// FIX: brakująca domyślna ikona Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AddArtPage = () => {
  const [position, setPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [useGeolocation, setUseGeolocation] = useState(true);

  useEffect(() => {
    if (useGeolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, [useGeolocation]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!position || !image || !title) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const imageRef = ref(storage, `arts/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(firestore, 'arts'), {
        title,
        imageUrl: url,
        location: {
          lat: position[0],
          lng: position[1]
        },
        createdAt: new Date()
      });

      alert('Art added!');
    } catch (error) {
      console.error(error);
      alert('Error submitting art: ' + error.message);
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!useGeolocation) {
          setPosition([e.latlng.lat, e.latlng.lng]);
        }
      }
    });

    return position ? <Marker position={position} /> : null;
  }

  function RecenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position);
      }
    }, [position]);
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', px: 2 }}>
        <h1 className="text-2xl font-bold mb-4">Add New Street Art</h1>

        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 2 }}
        >
          Upload Image
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        <FormControlLabel
          control={
            <Checkbox
              checked={useGeolocation}
              onChange={(e) => setUseGeolocation(e.target.checked)}
            />
          }
          label="Use current location"
        />

        <Box sx={{ height: 400, mb: 3 }}>
          <MapContainer
            center={position || [52.2297, 21.0122]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap position={position} />
            <LocationMarker />
          </MapContainer>
        </Box>

        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default AddArtPage;
