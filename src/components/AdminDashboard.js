import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return <div>Admin Dashboard Placeholder</div>;
};

export default AdminDashboard;
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRobot, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo.png';

