import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [formData, setFormData] = useState({
    role: 'user',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'role' ? value.toLowerCase() : value;
    setFormData({ ...formData, [name]: updatedValue });
    setError('');

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 6) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const getStrengthText = () => {
    if (passwordStrength < 33) return 'weak';
    if (passwordStrength < 66) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const { role, user } = response.data;
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', role);

        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'user') {
          navigate('/user-dashboard');
        } else {
          setError('Unknown role received from server');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        setError('No response from server. Check if backend is running.');
      } else {
        setError('An unexpected error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen font-['Inter']"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="Logo" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 hover:text-black px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="#" className="text-gray-900 hover:text-black px-3 py-2 rounded-md text-sm font-medium">About</a>
                <a href="#" className="text-gray-900 hover:text-black px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16 bg-black bg-opacity-50">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <img className="mx-auto h-12 w-auto" src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="Company Logo" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-200">Sign in to access the Employee Portal</p>
          </div>

          <div className="bg-white/95 p-8 shadow-xl rounded-lg border border-gray-100 backdrop-blur-sm">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="mt-1 relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      placeholder="Enter your email address"
                    />
                    {formData.email && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      placeholder="Enter your password"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-1 bg-black transition-all duration-300"
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password strength: <span className="font-medium">{getStrengthText()}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-md bg-black py-4 px-4 text-white font-semibold hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 flex items-center justify-center text-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                Don't have an account?
                <a href="/register" className="font-semibold text-black hover:text-black/90 transition-colors duration-300">
                  Register here
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-200">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@company.com" className="text-black hover:text-black/90">
                support@company.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
