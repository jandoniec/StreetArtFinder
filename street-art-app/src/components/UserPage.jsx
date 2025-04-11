import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box,Card, CardContent, Typography, CardMedia } from '@mui/material';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import AppBarComponent from './AppBar';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const UserPage = () => {
  const [user, setUser] = useState({ userName: '' });
  const [arts, setArts] = useState([]);
  const navigate = useNavigate();
  const [userArts,setUserArts]=useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      console.log(currentUser.name)
      if (currentUser) {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser({ userName: userDoc.data().name });
        }
      }
    };

    const fetchAllArts = async () => {
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
    const fetchUserArts = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const userArts = userData?.arts || [];

        const artsList = [];
        for (let artId of userArts) {
          const artDoc = await getDoc(doc(firestore, 'arts', artId));
          if (artDoc.exists()) {
            artsList.push({ id: artDoc.id, ...artDoc.data() });
          }
        }
        setUserArts(artsList);
      }
    };


    fetchUserData();
    fetchAllArts();
    fetchUserArts();
  }, []);

  // const handleLogout = () => {
  //   navigate('/login');
  // };

  const handleAdd = () => {
    navigate('/add-art');
  };
  const handleSeeAll=()=>{
    navigate('/arts')
  }

return (
  <div>
    <AppBarComponent />
    <div className="container bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen text-white">
      <div className="max-w-6xl mx-auto p-6">

        {userArts.length === 0 ? (
          <p className="text-center text-lg">You didn't add anything yet.</p>
        ) : (
     
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
            <Typography variant='h3' color='primary' fontStyle='bold'>Your Arts</Typography>

            {userArts.map((art) => (
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
                onClick={() => navigate(`/art/${art.id}`)}
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
                  <Typography variant="h6">{art.title}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="contained" sx={{margin:'20px'}} color="primary" size="large" onClick={handleAdd}>
            Add New
          </Button>
          <Button variant="contained" sx={{margin:'20px'}} size="large" color="primary" onClick={handleSeeAll}>
            See all arts
          </Button>
        </div>
      </div>
    </div>
  </div>
);
};


export default UserPage;
