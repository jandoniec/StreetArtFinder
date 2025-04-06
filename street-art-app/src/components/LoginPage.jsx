import { FormControl, InputLabel, Input, Button, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
    } catch (error) {
      alert('Error logging in: ' + error.message);
    }
  };

  return (
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
      <Typography variant="h4" component="p" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 360 }}>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;