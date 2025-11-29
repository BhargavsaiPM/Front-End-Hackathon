import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../user/UserPages.css';

const Availability = () => {
  const [availability, setAvailability] = useState({
    status: 'offline',
    note: '',
    time_window: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await api.get('/api/availability/me');
      if (response.data.availability) {
        setAvailability({
          status: response.data.availability.status || 'offline',
          note: response.data.availability.note || '',
          time_window: response.data.availability.time_window || ''
        });
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/api/availability/me', availability);
      setMessage('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      setMessage('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAvailability({
      ...availability,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="request-page">
      <h1>Update Availability</h1>
      <p className="page-description">
        Set your availability status so users can see when you're available to help.
      </p>

      {message && (
        <div className={message.includes('success') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={availability.status}
            onChange={handleChange}
            required
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="time_window">Available Hours (Optional)</label>
          <input
            type="text"
            id="time_window"
            name="time_window"
            value={availability.time_window}
            onChange={handleChange}
            placeholder="e.g., Monday-Friday, 10 AM - 6 PM"
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (Optional)</label>
          <textarea
            id="note"
            name="note"
            value={availability.note}
            onChange={handleChange}
            rows="3"
            placeholder="Add any additional information about your availability"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Availability'}
        </button>
      </form>
    </div>
  );
};

export default Availability;

