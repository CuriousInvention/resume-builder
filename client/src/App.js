// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
import TemplatePreview from './pages/template/TemplatePreview'; // <-- new preview page

const isAuthenticated = () => !!localStorage.getItem('user');

const PrivateRoute = ({ element }) => {
  const location = useLocation();
  return isAuthenticated() ? element : <Navigate to="/login" state={{ from: location }} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/resume/:id" element={<PrivateRoute element={<ResumeEditor />} />} />
        <Route path="/template/:id" element={<PrivateRoute element={<TemplatePreview />} />} />
      </Routes>
    </Router>
  );
}

export default App;
