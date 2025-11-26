import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Building2, Package, LayoutDashboard, Calendar, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Church Venue Hiring
          </Link>
          <div className="navbar-links">
            <Link to="/venues">
              <Building2 size={18} strokeWidth={1.5} />
              <span>Venues</span>
            </Link>
            <Link to="/equipment">
              <Package size={18} strokeWidth={1.5} />
              <span>Equipment</span>
            </Link>
            {user ? (
              <>
                <Link to="/dashboard">
                  <LayoutDashboard size={18} strokeWidth={1.5} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/bookings">
                  <Calendar size={18} strokeWidth={1.5} />
                  <span>My Bookings</span>
                </Link>
                {(user.email === 'admin@church.com' || user.email?.includes('admin')) && (
                  <Link to="/admin">
                    <Shield size={18} strokeWidth={1.5} />
                    <span>Admin</span>
                  </Link>
                )}
                <span className="navbar-user">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  <LogOut size={18} strokeWidth={1.5} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <LogIn size={18} strokeWidth={1.5} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <UserPlus size={18} strokeWidth={1.5} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

