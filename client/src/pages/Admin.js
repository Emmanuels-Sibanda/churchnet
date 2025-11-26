import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, Building2, Package, Calendar, 
  TrendingUp, AlertCircle, CheckCircle, XCircle,
  Eye, Trash2, Shield
} from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'venues') {
      fetchVenues();
    } else if (activeTab === 'equipment') {
      fetchEquipment();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics. You may not have admin access.');
      console.error('Admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axios.get('/api/admin/venues');
      setVenues(response.data);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('/api/admin/equipment');
      setEquipment(response.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) {
      return;
    }
    try {
      await axios.delete(`/api/admin/venues/${id}`);
      fetchVenues();
      fetchStats();
    } catch (err) {
      alert('Failed to delete venue');
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) {
      return;
    }
    try {
      await axios.delete(`/api/admin/equipment/${id}`);
      fetchEquipment();
      fetchStats();
    } catch (err) {
      alert('Failed to delete equipment');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: AlertCircle, color: '#ffc107', label: 'Pending' },
      approved: { icon: CheckCircle, color: '#28a745', label: 'Approved' },
      rejected: { icon: XCircle, color: '#dc3545', label: 'Rejected' },
      completed: { icon: CheckCircle, color: '#17a2b8', label: 'Completed' },
      cancelled: { icon: XCircle, color: '#6c757d', label: 'Cancelled' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className="status-badge" style={{ backgroundColor: badge.color }}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return <div className="container">Loading admin dashboard...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <Shield size={24} />
          <h2>Admin Access Required</h2>
          <p>{error}</p>
          <p>Please contact the system administrator if you believe you should have access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>
            <Shield size={28} />
            Admin Dashboard
          </h1>
          <p>Manage users, venues, equipment, and bookings</p>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={18} />
            Dashboard
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Users ({stats.totalChurches || 0})
          </button>
          <button
            className={activeTab === 'venues' ? 'active' : ''}
            onClick={() => setActiveTab('venues')}
          >
            <Building2 size={18} />
            Venues ({stats.totalVenues || 0})
          </button>
          <button
            className={activeTab === 'equipment' ? 'active' : ''}
            onClick={() => setActiveTab('equipment')}
          >
            <Package size={18} />
            Equipment ({stats.totalEquipment || 0})
          </button>
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={18} />
            Bookings ({stats.totalBookings || 0})
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <Users size={32} className="stat-icon" />
                <div className="stat-content">
                  <h3>{stats.totalChurches || 0}</h3>
                  <p>Total Churches</p>
                </div>
              </div>
              <div className="stat-card">
                <Building2 size={32} className="stat-icon" />
                <div className="stat-content">
                  <h3>{stats.totalVenues || 0}</h3>
                  <p>Total Venues</p>
                </div>
              </div>
              <div className="stat-card">
                <Package size={32} className="stat-icon" />
                <div className="stat-content">
                  <h3>{stats.totalEquipment || 0}</h3>
                  <p>Total Equipment</p>
                </div>
              </div>
              <div className="stat-card">
                <Calendar size={32} className="stat-icon" />
                <div className="stat-content">
                  <h3>{stats.totalBookings || 0}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>
              <div className="stat-card alert">
                <AlertCircle size={32} className="stat-icon" />
                <div className="stat-content">
                  <h3>{stats.pendingBookings || 0}</h3>
                  <p>Pending Bookings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.city ? `${user.city}, ${user.province || ''}` : '-'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString('en-ZA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'venues' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Church</th>
                  <th>Location</th>
                  <th>Price/Hour</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.map(venue => (
                  <tr key={venue.id}>
                    <td>{venue.id}</td>
                    <td>{venue.name}</td>
                    <td>{venue.church_name}</td>
                    <td>{venue.city ? `${venue.city}, ${venue.province || ''}` : '-'}</td>
                    <td>R{parseFloat(venue.price_per_hour).toFixed(2)}</td>
                    <td>{venue.capacity || '-'}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteVenue(venue.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Church</th>
                  <th>Category</th>
                  <th>Price/Hour</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.church_name}</td>
                    <td>{item.category || '-'}</td>
                    <td>{item.price_per_hour ? `R${parseFloat(item.price_per_hour).toFixed(2)}` : '-'}</td>
                    <td>{item.quantity || 1}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteEquipment(item.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Booker</th>
                  <th>Owner</th>
                  <th>Dates</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.booking_type}</td>
                    <td>{booking.venue_name || booking.equipment_name || '-'}</td>
                    <td>{booking.booker_name}<br/><small>{booking.booker_email}</small></td>
                    <td>{booking.owner_name || '-'}</td>
                    <td>
                      {new Date(booking.start_date).toLocaleDateString('en-ZA')}<br/>
                      <small>{new Date(booking.start_date).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</small>
                    </td>
                    <td>R{parseFloat(booking.total_price).toFixed(2)}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

