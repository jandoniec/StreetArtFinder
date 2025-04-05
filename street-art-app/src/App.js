import React from "react";
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import LoginPage  from "./components/LoginPage";
import UserPage from "./components/UserPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
