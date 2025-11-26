import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetail from './pages/VenueDetail';
import Equipment from './pages/Equipment';
import EquipmentDetail from './pages/EquipmentDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Diagnostic from './components/Diagnostic';
import './App.css';

function App() {
  console.log('App component rendering');
  
  // Show diagnostic in development
  const showDiagnostic = process.env.NODE_ENV === 'development' && 
    window.location.search.includes('diagnostic=true');

  try {
    return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Navbar />
          {showDiagnostic && (
            <div style={{ position: 'fixed', top: '60px', right: '20px', zIndex: 9999 }}>
              <Diagnostic />
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div>Error: {error.message}</div>;
  }
}

export default App;

