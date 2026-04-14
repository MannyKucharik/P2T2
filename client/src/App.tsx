import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register'; 
import Verify from './Verify';
import ForgotPassword from './ForgotPassword';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page displays the Login component */}
          <Route path="/" element={<Login />} />

          {/* New Authentication Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Catch-all route to redirect any unknown URLs back to Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;