import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Building2, MapPin, Users, DollarSign, Calendar, CheckCircle, Wifi, Car, Bath, Package } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import './VenueDetail.css';

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get today's date in datetime-local format with 7am default
  const getTodayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T07:00`;
  };

  // Validate time is between 7am and 6pm
  const validateTime = (dateTimeString) => {
    if (!dateTimeString) return false;
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    return hours >= 7 && hours < 18; // 7am to 5:59pm (6pm is exclusive)
  };

  const [booking, setBooking] = useState({
    start_date: getTodayDateTime(),
    end_date: getTodayDateTime(),
    price_option: 'hourly',
    selected_equipment: [],
    notes: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVenue();
    fetchEquipment();
  }, [id]);

  const fetchVenue = async () => {
    try {
      const response = await axios.get(`/api/venues/${id}`);
      setVenue(response.data);
    } catch (error) {
      console.error('Error fetching venue:', error);
      setMessage('Error loading venue details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('/api/equipment');
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleEquipmentToggle = (equipmentId) => {
    setBooking(prev => {
      const isSelected = prev.selected_equipment.includes(equipmentId);
      return {
        ...prev,
        selected_equipment: isSelected
          ? prev.selected_equipment.filter(id => id !== equipmentId)
          : [...prev.selected_equipment, equipmentId]
      };
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    // Validate time constraints (7am - 6pm)
    if (!validateTime(booking.start_date)) {
      setMessage('Error: Start time must be between 7:00 AM and 5:59 PM');
      return;
    }
    if (!validateTime(booking.end_date)) {
      setMessage('Error: End time must be between 7:00 AM and 5:59 PM');
      return;
    }

    // Validate end time is after start time
    if (new Date(booking.end_date) <= new Date(booking.start_date)) {
      setMessage('Error: End time must be after start time');
      return;
    }

    try {
      const bookingData = {
        booking_type: booking.selected_equipment.length > 0 ? 'venue_with_equipment' : 'venue',
        venue_id: id,
        start_date: booking.start_date,
        end_date: booking.end_date,
        price_option: booking.price_option,
        equipment_ids: booking.selected_equipment,
        notes: booking.notes
      };

      await axios.post('/api/bookings', bookingData);
      setMessage('Booking request submitted successfully!');
      setBooking({ 
        start_date: getTodayDateTime(), 
        end_date: getTodayDateTime(), 
        price_option: 'hourly',
        selected_equipment: [],
        notes: '' 
      });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create booking');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!venue) {
    return <div className="container">Venue not found</div>;
  }

  return (
    <div className="venue-detail">
      <div className="container">
        <h1>{venue.name}</h1>

        <div className="venue-detail-content">
          <div className="venue-main">
            <div className="venue-images">
              {venue.images && venue.images.length > 0 ? (
                <div className="image-gallery">
                  <div className="main-image">
                    <img 
                      src={venue.images[0]} 
                      alt={venue.name}
                      id="main-venue-image"
                    />
                  </div>
                  {venue.images.length > 1 && (
                    <div className="thumbnail-grid">
                      {venue.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${venue.name} ${idx + 1}`}
                          className={idx === 0 ? 'active' : ''}
                          onClick={() => {
                            document.getElementById('main-venue-image').src = img;
                            document.querySelectorAll('.thumbnail-grid img').forEach((thumb, i) => {
                              thumb.classList.toggle('active', i === idx);
                            });
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="placeholder-image">No Images Available</div>
              )}
            </div>

            <div className="venue-description">
              <h2>Description</h2>
              <p>{venue.description || 'No description provided.'}</p>

              <h2>Details</h2>
              <div className="venue-details">
                <div className="detail-item">
                  <Building2 size={18} strokeWidth={1.5} className="detail-icon" />
                  <div>
                    <strong>Church:</strong> {venue.church_name}
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} strokeWidth={1.5} className="detail-icon" />
                  <div>
                    <strong>Location:</strong> {venue.city}, {venue.province || venue.church_province}
                  </div>
                </div>
                {venue.capacity && (
                  <div className="detail-item">
                    <Users size={18} strokeWidth={1.5} className="detail-icon" />
                    <div>
                      <strong>Capacity:</strong> {venue.capacity} people
                    </div>
                  </div>
                )}
                <div className="detail-item">
                  <DollarSign size={18} strokeWidth={1.5} className="detail-icon" />
                  <div>
                    <strong>Price per Hour:</strong> {formatCurrency(venue.price_per_hour)}
                  </div>
                </div>
                {venue.price_per_half_day && (
                  <div className="detail-item">
                    <DollarSign size={18} strokeWidth={1.5} className="detail-icon" />
                    <div>
                      <strong>Price per Half Day:</strong> {formatCurrency(venue.price_per_half_day)}
                    </div>
                  </div>
                )}
                {venue.price_per_day && (
                  <div className="detail-item">
                    <DollarSign size={18} strokeWidth={1.5} className="detail-icon" />
                    <div>
                      <strong>Price per Day:</strong> {formatCurrency(venue.price_per_day)}
                    </div>
                  </div>
                )}
                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="detail-item">
                    <div>
                      <strong>Amenities:</strong>
                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {venue.amenities.includes('wifi') && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                            <Wifi size={14} /> WiFi
                          </span>
                        )}
                        {venue.amenities.includes('parking') && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                            <Car size={14} /> Parking
                          </span>
                        )}
                        {venue.amenities.includes('restrooms') && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                            <Bath size={14} /> Restrooms
                          </span>
                        )}
                      </div>
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
                Book This Venue
              </h3>
              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label htmlFor="start-date-time">Start Date & Time *</label>
                  <input
                    id="start-date-time"
                    name="start_date"
                    type="datetime-local"
                    value={booking.start_date}
                    onChange={(e) => setBooking({ ...booking, start_date: e.target.value })}
                    min={`${new Date().toISOString().split('T')[0]}T07:00`}
                    max={`${new Date().toISOString().split('T')[0]}T17:59`}
                    step="3600"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    Venues are available between 7:00 AM and 6:00 PM daily
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="end-date-time">End Date & Time *</label>
                  <input
                    id="end-date-time"
                    name="end_date"
                    type="datetime-local"
                    value={booking.end_date}
                    onChange={(e) => setBooking({ ...booking, end_date: e.target.value })}
                    min={booking.start_date || `${new Date().toISOString().split('T')[0]}T07:00`}
                    max={`${new Date().toISOString().split('T')[0]}T17:59`}
                    step="3600"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    Must be after start time, before 6:00 PM
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="price-option">Pricing Option</label>
                  <select
                    id="price-option"
                    name="price_option"
                    value={booking.price_option}
                    onChange={(e) => setBooking({ ...booking, price_option: e.target.value })}
                    required
                  >
                    <option value="hourly">Hourly - {formatCurrency(venue.price_per_hour)}/hour</option>
                    {venue.price_per_half_day && (
                      <option value="half_day">Half Day - {formatCurrency(venue.price_per_half_day)}</option>
                    )}
                    {venue.price_per_day && (
                      <option value="full_day">Full Day - {formatCurrency(venue.price_per_day)}</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="equipment-selection">
                    <Package size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Add Equipment (Optional)
                  </label>
                  {equipment.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '14px', padding: '12px', textAlign: 'center' }}>
                      No equipment available
                    </p>
                  ) : (
                    <div id="equipment-selection" className="equipment-selection" role="group" aria-label="Equipment selection">
                      {['Audio', 'Video', 'Lighting', 'Staging', 'Furniture', 'Other'].map(category => {
                        const categoryItems = equipment.filter(item => item.category === category);
                        if (categoryItems.length === 0) return null;
                        
                        return (
                          <div key={category} className="equipment-category-group">
                            <div className="category-header">
                              <strong>{category}</strong>
                              <span className="category-count">{categoryItems.length} items</span>
                            </div>
                            <div className="equipment-items">
                              {categoryItems.map(item => (
                                <div
                                  key={item.id}
                                  className={`equipment-item-card ${booking.selected_equipment.includes(item.id) ? 'selected' : ''}`}
                                  onClick={() => handleEquipmentToggle(item.id)}
                                >
                                  <input
                                    id={`equipment-checkbox-${item.id}`}
                                    name={`equipment-${item.id}`}
                                    type="checkbox"
                                    checked={booking.selected_equipment.includes(item.id)}
                                    onChange={() => handleEquipmentToggle(item.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Select ${item.name}`}
                                  />
                                  <label htmlFor={`equipment-checkbox-${item.id}`} style={{ display: 'none' }}>{item.name}</label>
                                  <div className="equipment-item-info">
                                    <div className="equipment-item-name">{item.name}</div>
                                    <div className="equipment-item-details">
                                      {item.price_per_hour ? (
                                        <span>{formatCurrency(item.price_per_hour)}/hr</span>
                                      ) : (
                                        <span>{formatCurrency(item.price_per_day)}/day</span>
                                      )}
                                      {item.quantity && <span>• Qty: {item.quantity}</span>}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      {equipment.filter(item => !item.category || !['Audio', 'Video', 'Lighting', 'Staging', 'Furniture', 'Other'].includes(item.category)).length > 0 && (
                        <div className="equipment-category-group">
                          <div className="category-header">
                            <strong>Other</strong>
                          </div>
                          <div className="equipment-items">
                            {equipment.filter(item => !item.category || !['Audio', 'Video', 'Lighting', 'Staging', 'Furniture', 'Other'].includes(item.category)).map(item => (
                              <div
                                key={item.id}
                                className={`equipment-item-card ${booking.selected_equipment.includes(item.id) ? 'selected' : ''}`}
                                onClick={() => handleEquipmentToggle(item.id)}
                              >
                                <input
                                  id={`equipment-checkbox-other-${item.id}`}
                                  name={`equipment-other-${item.id}`}
                                  type="checkbox"
                                  checked={booking.selected_equipment.includes(item.id)}
                                  onChange={() => handleEquipmentToggle(item.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Select ${item.name}`}
                                />
                                <label htmlFor={`equipment-checkbox-other-${item.id}`} style={{ display: 'none' }}>{item.name}</label>
                                <div className="equipment-item-info">
                                  <div className="equipment-item-name">{item.name}</div>
                                  <div className="equipment-item-details">
                                    {item.price_per_hour ? (
                                      <span>{formatCurrency(item.price_per_hour)}/hr</span>
                                    ) : (
                                      <span>{formatCurrency(item.price_per_day)}/day</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="booking-notes">Notes (Optional)</label>
                  <textarea
                    id="booking-notes"
                    name="notes"
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

export default VenueDetail;

