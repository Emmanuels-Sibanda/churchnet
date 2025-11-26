import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Tag, DollarSign, Eye } from 'lucide-react';
import { formatCurrencyShort } from '../utils/currency';
import './Equipment.css';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`/api/equipment?${params.toString()}`);
      console.log('Equipment response:', response.data);
      setEquipment(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      console.error('Error details:', error.response?.data);
      setEquipment([]);
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
    return <div className="container">Loading equipment...</div>;
  }

  return (
    <div className="equipment-page">
      <div className="container">
        <h1>Available Equipment</h1>

        <div className="filters">
          <div className="filter-input-wrapper">
            <Tag size={18} strokeWidth={1.5} className="filter-icon" />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="Video">Video</option>
              <option value="Lighting">Lighting</option>
              <option value="Staging">Staging</option>
              <option value="Other">Other</option>
            </select>
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

        {equipment.length === 0 ? (
          <div className="no-results">No equipment found matching your criteria.</div>
        ) : (
          <div className="grid">
            {equipment.map(item => (
              <div key={item.id} className="equipment-card">
                <div className="equipment-image">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="equipment-info">
                  <h3>{item.name}</h3>
                  {item.category && (
                    <span className="equipment-category">{item.category}</span>
                  )}
                  <p className="equipment-location">{item.church_city}, {item.church_province}</p>
                  <p className="equipment-church">by {item.church_name}</p>
                  {item.quantity && (
                    <p className="equipment-quantity">Available: {item.quantity}</p>
                  )}
                  {item.price_per_hour && (
                    <p className="equipment-price">{formatCurrencyShort(item.price_per_hour)}/hour</p>
                  )}
                  {item.price_per_day && (
                    <p className="equipment-price">{formatCurrencyShort(item.price_per_day)}/day</p>
                  )}
                  <Link to={`/equipment/${item.id}`} className="btn btn-primary">
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

export default Equipment;

