import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Calendar, List, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import './MyBookings.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [myListingsBookings, setMyListingsBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('my-bookings');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      if (activeTab === 'my-bookings') {
        const response = await axios.get('/api/bookings');
        setBookings(response.data);
      } else {
        const response = await axios.get('/api/bookings/my-listings');
        setMyListingsBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status });
      setMessage('Booking status updated successfully!');
      fetchBookings();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      approved: '#28a745',
      rejected: '#dc3545',
      completed: '#17a2b8',
      cancelled: '#6c757d'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return <div className="container">Loading bookings...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="container">
        <h1>My Bookings</h1>

        <div className="bookings-tabs">
          <button
            className={activeTab === 'my-bookings' ? 'active' : ''}
            onClick={() => setActiveTab('my-bookings')}
          >
            <Calendar size={18} strokeWidth={1.5} />
            <span>My Bookings</span>
          </button>
          <button
            className={activeTab === 'listings' ? 'active' : ''}
            onClick={() => setActiveTab('listings')}
          >
            <List size={18} strokeWidth={1.5} />
            <span>Bookings for My Listings</span>
          </button>
        </div>

        {message && (
          <div className={message.includes('Error') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        {activeTab === 'my-bookings' ? (
          <div>
            {bookings.length === 0 ? (
              <div className="no-bookings">No bookings found.</div>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h3>
                        {booking.booking_type === 'venue' ? booking.venue_name : booking.equipment_name}
                      </h3>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Type:</strong> {booking.booking_type}</p>
                      <p><strong>Start:</strong> {new Date(booking.start_date).toLocaleString()}</p>
                      <p><strong>End:</strong> {new Date(booking.end_date).toLocaleString()}</p>
                      <p><strong>Total Price:</strong> {formatCurrency(booking.total_price)}</p>
                      {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {myListingsBookings.length === 0 ? (
              <div className="no-bookings">No bookings for your listings.</div>
            ) : (
              <div className="bookings-list">
                {myListingsBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h3>
                        {booking.booking_type === 'venue' ? booking.venue_name : booking.equipment_name}
                      </h3>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Booked by:</strong> {booking.booking_church_name}</p>
                      <p><strong>Type:</strong> {booking.booking_type}</p>
                      <p><strong>Start:</strong> {new Date(booking.start_date).toLocaleString()}</p>
                      <p><strong>End:</strong> {new Date(booking.end_date).toLocaleString()}</p>
                      <p><strong>Total Price:</strong> {formatCurrency(booking.total_price)}</p>
                      {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                    </div>
                    {booking.status === 'pending' && (
                      <div className="booking-actions">
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'approved')}
                          className="btn btn-success"
                        >
                          <CheckCircle size={18} strokeWidth={1.5} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                          className="btn btn-danger"
                        >
                          <XCircle size={18} strokeWidth={1.5} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

