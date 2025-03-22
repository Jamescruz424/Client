import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ role: 'user', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending login data:', formData); // Debug payload
    try {
      const response = await axios.post(`${apiUrl}/login`, formData);
      console.log('Server response:', response.data); // Debug response
      if (response.data.success) {
        const { role } = response.data;
        // Navigate based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (error) {
      console.log('Full error response:', error.response); // Debug error
      if (error.response) {
        setError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        setError('No response from server. Check if backend is running.');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
