import { FormControl, InputLabel, Input, Button, Box, Typography, AppBar, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {Link} from '@mui/material';
const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        name: username,
        email: email,
        uid: user.uid
      });
      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      alert('Error registering: ' + error.message);
      navigate('/');
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
         
            <Typography variant="h5" component="div" sx={{ textAlign: 'center', flexGrow: 1 }}>
              StreetArtFinder
            </Typography>
            </Toolbar>
            
        </AppBar>
    <Box 
      className='registerForm' 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: 2 
      }}
    >
      <Typography variant="h4" component="p" color='primary' gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: 360 }}>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Register
        </Button>
        <Typography color='primary' sx={{textAlign:'center',paddingTop:'15px'}}>Already have an account?</Typography>
        <Link href='/StreetArtFinder' sx={{display: 'flex', paddingTop:'15px',justifyContent: 'center'}}>Click here to sign in!</Link>
      </form>
    </Box>
    </div>
  );
};

export default RegisterPage;
