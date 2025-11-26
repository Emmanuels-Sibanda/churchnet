import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Users, DollarSign, Eye } from 'lucide-react';
import { formatCurrencyShort } from '../utils/currency';
import './Venues.css';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    province: '',
    minCapacity: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchVenues();
  }, [filters]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get('/api/provinces');
      if (Array.isArray(response.data)) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      // Fallback to South African provinces if API fails
      setProvinces([
        'Eastern Cape',
        'Free State',
        'Gauteng',
        'KwaZulu-Natal',
        'Limpopo',
        'Mpumalanga',
        'Northern Cape',
        'North West',
        'Western Cape'
      ]);
    }
  };

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.province) params.append('province', filters.province);
      if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`/api/venues?${params.toString()}`);
      console.log('Venues response:', response.data);
      setVenues(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching venues:', error);
      console.error('Error details:', error.response?.data);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="container">Loading venues...</div>;
  }

  return (
    <div className="venues-page">
      <div className="container">
        <h1>Available Venues</h1>

        <div className="filters">
          <div className="filter-input-wrapper">
            <MapPin size={18} strokeWidth={1.5} className="filter-icon" />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-input-wrapper">
            <MapPin size={18} strokeWidth={1.5} className="filter-icon" />
            <select
              name="province"
              value={filters.province}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          <div className="filter-input-wrapper">
            <Users size={18} strokeWidth={1.5} className="filter-icon" />
            <input
              type="number"
              name="minCapacity"
              placeholder="Min Capacity"
              value={filters.minCapacity}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-input-wrapper">
            <DollarSign size={18} strokeWidth={1.5} className="filter-icon" />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price/Hour"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {venues.length === 0 ? (
          <div className="no-results">No venues found matching your criteria.</div>
        ) : (
          <div className="grid">
            {venues.map(venue => (
              <div key={venue.id} className="venue-card">
                <div className="venue-image">
                  {venue.images && venue.images.length > 0 ? (
                    <img src={venue.images[0]} alt={venue.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="venue-info">
                  <h3>{venue.name}</h3>
                  <p className="venue-location">{venue.city}, {venue.province || venue.church_province}</p>
                  <p className="venue-church">by {venue.church_name}</p>
                  {venue.capacity && (
                    <p className="venue-capacity">Capacity: {venue.capacity} people</p>
                  )}
                  <p className="venue-price">{formatCurrencyShort(venue.price_per_hour)}/hour</p>
                  <Link to={`/venues/${venue.id}`} className="btn btn-primary">
                    <Eye size={18} strokeWidth={1.5} />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;

