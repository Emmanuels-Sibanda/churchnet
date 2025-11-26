import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Building2, Package, Plus, Trash2, Wifi, Car, Bath, Image, X } from 'lucide-react';
import { formatCurrency, formatCurrencyShort } from '../utils/currency';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('venues');
  const [venues, setVenues] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyListings();
  }, [activeTab]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      if (activeTab === 'venues') {
        const response = await axios.get('/api/venues/my-venues');
        setVenues(response.data);
      } else {
        const response = await axios.get('/api/equipment/my-equipment');
        setEquipment(response.data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setMessage('Error: Maximum 10 images allowed');
      return;
    }
    setSelectedImages(files);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    setUploading(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.images || [];
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload images: ' + (error.response?.data?.error || error.message));
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    try {
      // Upload images first
      const imageUrls = await uploadImages();
      
      const submitData = {
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : formData.images || []
      };

      await axios.post('/api/venues', submitData);
      setMessage('Venue created successfully!');
      setShowForm(false);
      setFormData({});
      setSelectedImages([]);
      fetchMyListings();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create venue');
    }
  };

  const handleCreateEquipment = async (e) => {
    e.preventDefault();
    try {
      // Upload images first
      const imageUrls = await uploadImages();
      
      const submitData = {
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : formData.images || []
      };

      await axios.post('/api/equipment', submitData);
      setMessage('Equipment created successfully!');
      setShowForm(false);
      setFormData({});
      setSelectedImages([]);
      fetchMyListings();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to create equipment');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await axios.delete(`/api/${type}/${id}`);
      setMessage(`${type} deleted successfully!`);
      fetchMyListings();
    } catch (error) {
      setMessage(error.response?.data?.error || `Failed to delete ${type}`);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard - {user?.name}</h1>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'venues' ? 'active' : ''}
            onClick={() => setActiveTab('venues')}
          >
            <Building2 size={18} strokeWidth={1.5} />
            <span>My Venues</span>
          </button>
          <button
            className={activeTab === 'equipment' ? 'active' : ''}
            onClick={() => setActiveTab('equipment')}
          >
            <Package size={18} strokeWidth={1.5} />
            <span>My Equipment</span>
          </button>
        </div>

        {message && (
          <div className={message.includes('Error') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setFormData({});
            setSelectedImages([]);
            setMessage('');
          }}
          style={{ marginBottom: '20px' }}
        >
          {showForm ? (
            <>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus size={18} strokeWidth={1.5} />
              <span>Add New {activeTab === 'venues' ? 'Venue' : 'Equipment'}</span>
            </>
          )}
        </button>

        {showForm && (
          <div className="card">
            <h3>Create New {activeTab === 'venues' ? 'Venue' : 'Equipment'}</h3>
            <form onSubmit={activeTab === 'venues' ? handleCreateVenue : handleCreateEquipment}>
              {activeTab === 'venues' ? (
                <>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity || ''}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Price per Hour (R) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_per_hour || ''}
                        onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price per Half Day (R)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_per_half_day || ''}
                        onChange={(e) => setFormData({ ...formData, price_per_half_day: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Price per Day (R)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_per_day || ''}
                        onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Province</label>
                      <select
                        value={formData.province || ''}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      >
                        <option value="">Select Province</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="Northern Cape">Northern Cape</option>
                        <option value="North West">North West</option>
                        <option value="Western Cape">Western Cape</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Amenities</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.amenities?.includes('wifi') || false}
                          onChange={(e) => {
                            const amenities = formData.amenities || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, amenities: [...amenities, 'wifi'] });
                            } else {
                              setFormData({ ...formData, amenities: amenities.filter(a => a !== 'wifi') });
                            }
                          }}
                        />
                        <Wifi size={16} /> WiFi
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.amenities?.includes('parking') || false}
                          onChange={(e) => {
                            const amenities = formData.amenities || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, amenities: [...amenities, 'parking'] });
                            } else {
                              setFormData({ ...formData, amenities: amenities.filter(a => a !== 'parking') });
                            }
                          }}
                        />
                        <Car size={16} /> Parking
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.amenities?.includes('restrooms') || false}
                          onChange={(e) => {
                            const amenities = formData.amenities || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, amenities: [...amenities, 'restrooms'] });
                            } else {
                              setFormData({ ...formData, amenities: amenities.filter(a => a !== 'restrooms') });
                            }
                          }}
                        />
                        <Bath size={16} /> Restrooms
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <Image size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Images (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      style={{ marginTop: '8px' }}
                    />
                    {selectedImages.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {selectedImages.map((file, index) => (
                          <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(255, 0, 0, 0.7)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <X size={14} color="white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Maximum 10 images, 5MB each (JPEG, PNG, GIF, WebP)
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        <option value="Audio">Audio</option>
                        <option value="Video">Video</option>
                        <option value="Lighting">Lighting</option>
                        <option value="Staging">Staging</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="number"
                        value={formData.quantity || 1}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price per Hour</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_per_hour || ''}
                        onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Price per Day</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price_per_day || ''}
                        onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <Image size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Images (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      style={{ marginTop: '8px' }}
                    />
                    {selectedImages.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {selectedImages.map((file, index) => (
                          <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(255, 0, 0, 0.7)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <X size={14} color="white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Maximum 10 images, 5MB each (JPEG, PNG, GIF, WebP)
                    </p>
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Create'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'venues' ? (
          <div className="grid">
            {venues.length === 0 ? (
              <p>No venues listed yet. Create your first venue!</p>
            ) : (
              venues.map(venue => (
                <div key={venue.id} className="card">
                  <h3>{venue.name}</h3>
                  <p>{venue.description || 'No description'}</p>
                  <p><strong>Price:</strong> {formatCurrency(venue.price_per_hour)}/hour</p>
                  {venue.capacity && <p><strong>Capacity:</strong> {venue.capacity}</p>}
                  <button
                    onClick={() => handleDelete(venue.id, 'venues')}
                    className="btn btn-danger"
                    style={{ marginTop: '10px' }}
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid">
            {equipment.length === 0 ? (
              <p>No equipment listed yet. Create your first equipment listing!</p>
            ) : (
              equipment.map(item => (
                <div key={item.id} className="card">
                  <h3>{item.name}</h3>
                  <p>{item.description || 'No description'}</p>
                  {item.category && <p><strong>Category:</strong> {item.category}</p>}
                  {item.price_per_hour && <p><strong>Price:</strong> {formatCurrency(item.price_per_hour)}/hour</p>}
                  <button
                    onClick={() => handleDelete(item.id, 'equipment')}
                    className="btn btn-danger"
                    style={{ marginTop: '10px' }}
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

