import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { loginUser } from '../services/api'; // Adjust path if needed
import logo from "../assets/images/logo.png";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use the role from location.state if provided, otherwise default to 'user'
  const initialRole = location.state?.role || 'user';

  const [formData, setFormData] = useState({
    role: initialRole, // Set initial role from navigation state
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Update formData.role if location.state.role changes (e.g., on navigation)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: location.state?.role || 'user',
    }));
  }, [location.state?.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'role' ? value.toLowerCase() : value;
    setFormData({ ...formData, [name]: updatedValue });
    setError('');
    console.log('Form data updated:', { ...formData, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    console.log('Submitting login with data:', formData);

    try {
      const response = await loginUser(formData);
      console.log('Login response:', response.data);

      if (response.data.success) {
        const { role, user } = response.data;
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', role);
        console.log('Stored userId:', user.id, 'Role:', role);

        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'user') {
            navigate('/user-dashboard');
          } else {
            setError('Unknown role received from server');
          }
        }, 1500);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error details:', error);
      if (error.response) {
        setError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        setError('Network error: Unable to reach the server');
      } else {
        setError(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-['Inter'] flex flex-col justify-center items-center px-4 sm:px-6 md:px-8">
      <div className="max-w-md w-full space-y-4 sm:space-y-8 bg-white p-4 sm:p-6 md:p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <img className="mx-auto h-10 sm:h-12 w-auto" src={logo} alt="Logo" />
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">Please sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="role" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0">Role</label>
              <div className="relative inline-flex">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full sm:w-[120px] pl-3 pr-8 py-2 text-xs sm:text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-8 sm:pl-10 rounded-md border-gray-300 focus:ring-black focus:border-black text-xs sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-8 sm:pl-10 pr-10 rounded-md border-gray-300 focus:ring-black focus:border-black text-xs sm:text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">Remember me</label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 sm:py-2.5 px-3 sm:px-4 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-black hover:text-black/80">
            Sign up
          </Link>
        </p>
      </div>

      <footer className="mt-6 sm:mt-8 text-center">
        <div className="text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row sm:space-x-2 sm:items-center justify-center">
          <span>© 2024 Company. All rights reserved.</span>
          <span className="hidden sm:inline mx-2">·</span>
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <span className="hidden sm:inline mx-2">·</span>
          <a href="#" className="hover:text-gray-700">Terms</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
