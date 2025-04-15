import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
<div className="flex items-center">
  <Link to="/login">
    <button className="bg-white border border-blue-600 text-blue-600 px-4 py-2 text-sm font-medium mr-3">Sign In</button>
  </Link>
  <Link to="/register">
    <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium">Get Started</button>
  </Link>
</div>
<header className="relative bg-white overflow-hidden">
  <div className="max-w-8xl mx-auto flex flex-col-reverse lg:flex-row items-center">
    <div className="text-center lg:text-left p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
        <span className="block">Smart Inventory</span>
        <span className="block text-blue-600">Management System</span>
      </h1>
      <p className="mt-3 text-lg text-gray-500">
        Streamline your inventory with real-time tracking and powerful analytics.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row justify-center lg:justify-start">
        <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md mr-3">Admin Login</button>
        <button className="w-full sm:w-auto px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md">User Login</button>
      </div>
    </div>
    <div className="lg:w-1/2">
      <img className="w-full" src="https://source.unsplash.com/600x400/?warehouse,inventory" alt="Inventory" />
    </div>
  </div>
</header>

