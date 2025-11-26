import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Building2, MapPin, Tag, Package, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import './EquipmentDetail.css';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  // Get today's date in datetime-local format
  const getTodayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [booking, setBooking] = useState({
    start_date: getTodayDateTime(),
    end_date: getTodayDateTime(),
    notes: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get(`/api/equipment/${id}`);
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setMessage('Error loading equipment details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/bookings', {
        booking_type: 'equipment',
        equipment_id: id,
        start_date: booking.start_date,
        end_date: booking.end_date,
        notes: booking.notes
      });
      setMessage('Booking request submitted successfully!');
      setBooking({ start_date: getTodayDateTime(), end_date: getTodayDateTime(), notes: '' });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create booking');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!equipment) {
    return <div className="container">Equipment not found</div>;
  }

  return (
    <div className="equipment-detail">
      <div className="container">
        <h1>{equipment.name}</h1>

        <div className="equipment-detail-content">
          <div className="equipment-main">
            <div className="equipment-images">
              {equipment.images && equipment.images.length > 0 ? (
                equipment.images.map((img, idx) => (
                  <img key={idx} src={img} alt={equipment.name} />
                ))
              ) : (
                <div className="placeholder-image">No Images Available</div>
              )}
            </div>

            <div className="equipment-description">
              <h2>Description</h2>
              <p>{equipment.description || 'No description provided.'}</p>

              <h2>Details</h2>
              <div className="equipment-details">
                <div className="detail-item">
                  <Building2 size={18} strokeWidth={1.5} className="detail-icon" />
                  <div>
                    <strong>Church:</strong> {equipment.church_name}
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} strokeWidth={1.5} className="detail-icon" />
                  <div>
                    <strong>Location:</strong> {equipment.church_city}, {equipment.church_province}
                  </div>
                </div>
                {equipment.category && (
                  <div className="detail-item">
                    <Tag size={18} strokeWidth={1.5} className="detail-icon" />
                    <div>
                      <strong>Category:</strong> {equipment.category}
                    </div>
                  </div>
                )}
                {equipment.quantity && (
                  <div className="detail-item">
                    <Package size={18} strokeWidth={1.5} className="detail-icon" />
                    <div>
                      <strong>Available Quantity:</strong> {equipment.quantity}
                    </div>
                  </div>
                )}
                {equipment.price_per_hour && (
                  <div className="detail-item">
                    <DollarSign size={18} strokeWidth={1.5} className="detail-icon" />
                    <div>
                      <strong>Price per Hour:</strong> {formatCurrency(equipment.price_per_hour)}
                    </div>
                  </div>
                )}
                {equipment.price_per_day && (
                  <div className="detail-item">
                    <DollarSign size={18} strokeWidth={1.5} className="detail-icon" />
                    <div>
                      <strong>Price per Day:</strong> {formatCurrency(equipment.price_per_day)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="booking-sidebar">
            <div className="booking-card">
              <h3>
                <Calendar size={20} strokeWidth={1.5} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Book This Equipment
              </h3>
              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label>Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={booking.start_date}
                    onChange={(e) => setBooking({ ...booking, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={booking.end_date}
                    onChange={(e) => setBooking({ ...booking, end_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    placeholder="Any special requests or information..."
                  />
                </div>
                {message && (
                  <div className={message.includes('Error') ? 'error' : 'success'}>
                    {message}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <CheckCircle size={18} strokeWidth={1.5} />
                  <span>Request Booking</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;

