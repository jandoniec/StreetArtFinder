import React from "react";
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import LoginPage  from "./components/LoginPage";
import UserPage from "./components/UserPage";
import AddArtPage from './components/AddArtPage';
import ArtDetailsPage from './components/ArtDetailsPage';
import RegisterPage from './components/RegisterPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-art" element={<AddArtPage />} />
        <Route path="/art/:id" element={<ArtDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
