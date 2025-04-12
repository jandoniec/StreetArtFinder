import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CardMedia, Button, FormControl, InputLabel, Select, MenuItem, Checkbox } from '@mui/material';
import { firestore } from '../firebase';  // Zakładając, że masz konfigurację Firestore
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AppBarComponent from './AppBar';
const Arts = () => {
  const [arts, setArts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsSnapshot = await getDocs(collection(firestore, 'tags'));
        const tagsList = tagsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableTags(tagsList);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

 
  useEffect(() => {
    const fetchArts = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, 'arts'));
        const artsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setArts(artsList);
        
        const usersPromises = artsList.map(async (art) => {
          if (art.userId) {
            const userDoc = await getDoc(doc(firestore, 'users', art.userId));
            if (userDoc.exists()) {
              console.log(`User found for artId ${art.id}: ${userDoc.data().name}`);  
              return {
                [art.userId]: userDoc.data().name
              };
            } else {
              console.log(`No user found for userId: ${art.userId}`); 
            }
          }
          return null;
        });

        const usersResults = await Promise.all(usersPromises);
        let userMap = {};
        usersResults.forEach((user) => {
          if (user) {
            userMap = { ...userMap, ...user };
          }
        });

 
        setUsers(userMap);
        console.log('Users map:', userMap);  

      } catch (error) {
        console.error('Error fetching arts:', error);
      }
    };

    fetchArts();
  }, []);

  const handleTagChange = (event) => {
    const value = event.target.value;
    setSelectedTags(value);
  };

  const filterArtsByTags = () => {
    if (selectedTags.length === 0) {
      return arts;
    }

    return arts.filter((art) =>
      art.tags?.some(tag => selectedTags.includes(tag))
    );
  };

  const handleCardClick = (id) => {
    navigate(`/art/${id}`);
  };

  return (
    <div>
      <AppBarComponent />
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {filterArtsByTags().length === 0 ? (
          <Typography color="primary" variant="h3">No arts found.</Typography>
        ) : (
          <>
            <Typography variant="h3" color="primary" paddingBottom="20px">
              All Street Arts
            </Typography>
  
            <Box sx={{ mb: 4, width: 150 }}>
              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={selectedTags}
                  onChange={handleTagChange}
                  renderValue={(selected) =>
                    selected.map(id => availableTags.find(tag => tag.id === id)?.name).join(', ')
                  }
                  label="Tags"
                >
                  {availableTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Checkbox checked={selectedTags.indexOf(tag.id) > -1} />
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
  
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: 2,
              justifyItems: 'center',
              marginTop: 3,
              '@media(min-width: 1024px)': {
                gridTemplateColumns: 'repeat(auto-fill, minmax(900px, 1fr))',
              },
            }}>
              {filterArtsByTags().map((art) => (
                <Card
                  key={art.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: 700,
                    '&:hover': { boxShadow: 8 },
                    borderRadius: '8px',
                    boxShadow: 3
                  }}
                  onClick={() => handleCardClick(art.id)}
                >
                  {art.imageUrl && (
                    <CardMedia
                      component="img"
                      height="400"
                      image={art.imageUrl}
                      alt={art.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ padding: '16px' }}>
                    <Typography variant="h6" color='primary'>{art.title}</Typography>
                    {art.userId && users[art.userId] ? (
                      <Typography variant="body2" color="primary">
                        Added by: {users[art.userId]}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        User not found
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
  
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => navigate('/add-art')}
        >
          Add New Art
        </Button>
      </Box>
    </div>
  );
  
  
  
};

export default Arts;
