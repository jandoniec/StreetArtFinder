import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

const ArtDetailsPage = () => {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const docRef = doc(firestore, 'arts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArt(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArt();
  }, [id]);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  if (!art) return <Typography variant="h6">Art not found.</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>{art.title}</Typography>
      <Box component="img" src={art.imageUrl} alt={art.title} sx={{ width: '100%', maxWidth: 600, borderRadius: 2 }} />
      <Typography sx={{ mt: 2 }} variant="body1">Latitude: {art.location.lat}</Typography>
      <Typography variant="body1">Longitude: {art.location.lng}</Typography>
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Created: {art.createdAt?.toDate?.().toLocaleString?.() || 'Unknown'}
      </Typography>
    </Container>
  );
};

export default ArtDetailsPage;
