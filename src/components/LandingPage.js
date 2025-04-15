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

