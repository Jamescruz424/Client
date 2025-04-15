import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
<div className="lg:w-1/2">
  <img className="w-full" src="https://source.unsplash.com/600x400/?warehouse,inventory" alt="Inventory" />
</div>
<section className="py-12 bg-white">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="lg:text-center">
      <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Manage inventory with ease</p>
    </div>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {[ 
        { icon: "fa-chart-line", title: "Real-time Tracking", desc: "Monitor inventory levels with automatic updates." },
        { icon: "fa-users", title: "Multi-user Management", desc: "Different access levels for administrators and users." },
        { icon: "fa-bell", title: "Automated Alerts", desc: "Get notifications when stock is low." },
        { icon: "fa-chart-pie", title: "Analytics Dashboard", desc: "Powerful reports for better decisions." }
      ].map((feature, index) => (
        <div key={index} className="flex">
          <div className="h-12 w-12 rounded-md bg-blue-600 text-white flex items-center justify-center">
            <i className={`fas ${feature.icon} text-xl`}></i>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
            <p className="text-base text-gray-500">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="bg-gray-50 py-12">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="lg:text-center">
      <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Statistics</h2>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Trusted by businesses worldwide</p>
    </div>
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
      {[ 
        { title: "Total Users", stat: "10,000+" },
        { title: "Items Tracked", stat: "1M+" },
        { title: "Hours Saved", stat: "100,000+" }
      ].map((item, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-6 text-center">
          <dt className="text-sm font-medium text-gray-500">{item.title}</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</dd>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="bg-gray-50 py-12">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-2xl font-extrabold text-gray-900">Watch How It Works</h2>
    <div className="mt-6">
      <iframe
        className="w-full h-64 sm:h-96"
        src="https://www.youtube.com/watch?v=0NOER-Lle-0"
        title="YouTube video"
        allowFullScreen
      ></iframe>
    </div>
  </div>
</section>
<footer className="bg-blue-600 text-white py-8">
  <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p className="text-lg font-semibold">Smart Inventory System</p>
    <p className="mt-2 text-sm">© 2025 All rights reserved.</p>
    <div className="mt-4 flex justify-center space-x-4">
      <a href="#" className="text-white hover:text-gray-200">
        <i className="fab fa-facebook-f"></i>
      </a>
      <a href="#" className="text-white hover:text-gray-200">
        <i className="fab fa-twitter"></i>
      </a>
      <a href="#" className="text-white hover:text-gray-200">
        <i className="fab fa-linkedin-in"></i>
      </a>
    </div>
  </div>
</footer>
<h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
  <span className="block">Smart Inventory</span>
  <span className="block text-blue-600">Management System</span>
</h1>

