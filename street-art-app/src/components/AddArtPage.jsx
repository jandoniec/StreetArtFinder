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
  Box,
  Typography
} from '@mui/material';
import { storage, firestore } from '../firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  getDocs,
  doc,updateDoc,getDoc
} from 'firebase/firestore';
import {  auth } from '../firebase';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import AppBarComponent from './AppBar';
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
  const [useCamera, setUseCamera] = useState(true);
  const [tags,setTags]=useState([])
  const [availableTags,setAvailableTags]=useState([])
  const navigate=useNavigate()
  
  useEffect(() => {
    if (useGeolocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, [useGeolocation]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'tags'));
        const tagsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setAvailableTags(tagsArray);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
  
    fetchTags();
  }, []);
  useEffect(()=>{
    console.log(tags)
  },[tags])

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!position || !image || !title) {
      alert('Please fill in all fields.');
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert('You must be logged in to add art.');
      return;
    }

    try {
      const imageRef = ref(storage, `arts/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);

      const artRef = await addDoc(collection(firestore, 'arts'), {
        title,
        imageUrl: url,
        location: {
          lat: position[0],
          lng: position[1]
        },
        tags: tags,
        createdAt: new Date(),
        userId: currentUser.uid, 
      });

  
      const userRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userArts = userData.arts || [];
        userArts.push(artRef.id);

        await updateDoc(userRef, { arts: userArts });
      }

      alert('Art added!');
      setTitle('');
      setImage(null);
      setTags([]);
      navigate('/userpage')
    } catch (error) {
      console.error('Error submitting art:', error);
      alert('Error submitting art: ' + error.message);
    }
  };
  const handleTagChange = (event) => {
    const value = event.target.value;
    setTags((prevTags) =>
      prevTags.includes(value)
        ? prevTags.filter((tag) => tag !== value)
        : [...prevTags, value]
    );
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
    <div>
      <AppBarComponent/>
   
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', px: 2 }}>
        <Typography variant='h3' color='primary' fontStyle='bold' textAlign={'center'}>Add New Street Art</Typography>

        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={useCamera}
              onChange={(e) => setUseCamera(e.target.checked)}
            />
          }
          label="Use camera to take photo"
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
            {...(useCamera ? { capture: "environment" } : {})}
          />
        </Button>

        {image && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">Selected: {image.name}</Typography>
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => setImage(null)}
            >
              Remove image
            </Button>
          </Box>
        )}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Select Tags</Typography>
          {availableTags.map((tag) => (
            <FormControlLabel
              key={tag.id}
              control={
                <Checkbox
                  value={tag.id}
                  checked={tags.includes(tag.id)}
                  onChange={handleTagChange}
                />
              }
              label={tag.name}
            />
          ))}
        </Box>


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
    </div>
  );
};

export default AddArtPage;
