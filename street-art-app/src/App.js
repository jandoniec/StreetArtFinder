import React from "react";
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import LoginPage  from "./components/LoginPage";
import UserPage from "./components/UserPage";
import AddArtPage from './components/AddArtPage';
import RegisterPage from './components/RegisterPage'
import Arts from "./components/Arts";
import ArtDetail from "./components/ArtDetail";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-art" element={<AddArtPage />} />
        <Route path="/art/:id" element={<ArtDetail />} />
        <Route path='/arts' element={<Arts />} />
      </Routes>
    </Router>
  );
}

export default App;
