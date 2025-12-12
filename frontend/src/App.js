import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shop from './Shop';
import Admin from './Admin';
import ProductDetail from './ProductDetail';
import Login from './Login';

// This is the "Bouncer" component
// It checks if you are allowed in. If not, it kicks you to Login.
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin');
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Everyone can see) */}
        <Route path="/" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route (Only Admin can see) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;