import React from "react";
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import LoginPage  from "./components/LoginPage";
import UserPage from "./components/UserPage";
import AddArtPage from './components/AddArtPage';
import ArtDetailsPage from './components/ArtDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add-art" element={<AddArtPage />} />
        <Route path="/art/:id" element={<ArtDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
