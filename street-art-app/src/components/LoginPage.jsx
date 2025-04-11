import { FormControl, InputLabel, Input, Button, Box, Typography, Toolbar, AppBar } from '@mui/material';
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from "firebase/firestore"; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user)
  
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        navigate('/userpage');
      } else {
        console.log('No such document!'); 
      }
  
      alert('Login successful!');
    } catch (error) {
      alert('Error logging in: ' + error.message);
    }
  };
  
  
  

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;

      await setDoc(doc(firestore, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        uid: user.uid
      });

      navigate('/userpage');
    }).catch((error) => {
      console.error("Error during Google login:", error);
    });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Typography variant="h5" component="div" sx={{ textAlign: 'center', flexGrow: 1 }}>
            StreetArtFinder
          </Typography>
        </Toolbar>
      </AppBar>
    <Box
      className='loginForm'
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
        Login
      </Typography>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 360, marginBottom: 16 }}>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button variant="contained" color="primary" type="submit" fullWidth >
          Login
        </Button>
      </form>
      <Button variant="contained" sx={{width:'360px' ,marginBottom:"20px"}} color="primary" type="submit" onClick={handleGoogleLogin}>Login with Google</Button>
      <Button variant="contained" sx={{width:'360px' ,marginBottom:"20px"}} color="primary" type="submit"  onClick={handleRegister} >
        Register
      </Button>
    </Box>
    </div>
  );
};

export default LoginPage;
