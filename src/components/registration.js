import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { registerUser } from '../services/api';
import logo from "../assets/images/logo.png";

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id: '',
    dept: '',
    password: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
    if (passwordStrength < 33) return 'Weak';
    if (passwordStrength < 66) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength < 33) return 'bg-red-500';
    if (passwordStrength < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordStrength < 50) {
      setError('Password is too weak. Please use a stronger password.');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting registration with data:', formData);
      const response = await registerUser(formData);
      console.log('Registration response:', response.data);
      setSuccess(response.data.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('Registration error details:', error);
      if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        setError('Network error: Unable to reach the server.');
      } else {
        setError(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src={logo}
                alt="Logo"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 sm:p-8 transform transition-all hover:scale-105">
          <div className="text-center mb-6">
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="Company Logo"
            />
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Join the Team
            </h2>
            <p className="mt-2 text-sm text-gray-600">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
              <div className="col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 transition-all"
                    placeholder="John Doe"
                  />
                  {formData.name && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 transition-all"
                    placeholder="you@example.com"
                  />
                  {formData.email && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label htmlFor="employee-id" className="block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  id="employee-id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 transition-all"
                  placeholder="EMP12345"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="department"
                  name="dept"
                  value={formData.dept}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 transition-all"
                >
                  <option value="">Select Department</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div className="col-span-1">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 transition-all"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-span-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 pr-10 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-200 rounded-full">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Strength: <span className="font-medium">{getStrengthText()}</span>
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-sm sm:text-base shadow-lg transform transition-all duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
              } flex items-center justify-center`}
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  Create Account
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={handleSignInClick}
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center">
        <p className="text-xs sm:text-sm">
          Need help? Contact us at{' '}
          <a href="mailto:support@company.com" className="text-indigo-400 hover:text-indigo-300">
            support@company.com
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Registration;
