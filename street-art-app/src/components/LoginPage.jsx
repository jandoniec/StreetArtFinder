import { FormControl, InputLabel, Input, Button } from '@mui/material';
import React from 'react';

const LoginPage = () => {
  return (
    <div className='loginForm'>
      <p>Login</p>
      <form>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input id="username" type="text" />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" />
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;