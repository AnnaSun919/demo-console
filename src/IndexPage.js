import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Main from "./pages/Main";
import BookingListPage from "./pages/BookingListPage";
import Dashboard from "./pages/Dashboard";
import BookRoom from "./pages/BookRoom";
import MyBookings from "./pages/MyBookings";
import ManageRooms from "./pages/ManageRooms";
import Groups from "./pages/Groups";
import UserBookings from "./pages/UserBookings";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/Layout";

export default function AuthRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Login />} path="/login" />
      <Route element={<Unauthorized />} path="/unauthorized" />

      {/* Authenticated user routes */}
      <Route element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} path="/dashboard" />
      <Route element={<ProtectedRoute><Layout><BookRoom /></Layout></ProtectedRoute>} path="/book-room" />
      <Route element={<ProtectedRoute><Layout><MyBookings /></Layout></ProtectedRoute>} path="/my-bookings" />
      <Route element={<ProtectedRoute><Layout><Main /></Layout></ProtectedRoute>} path="/main" />
      <Route element={<ProtectedRoute><Layout><BookingListPage /></Layout></ProtectedRoute>} path="/bookings" />

      {/* Admin routes (admin + superadmin) */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]}><Layout><ManageRooms /></Layout></ProtectedRoute>} path="/manage-rooms" />
      <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]}><Layout><Groups /></Layout></ProtectedRoute>} path="/groups" />
      <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]}><Layout><UserBookings /></Layout></ProtectedRoute>} path="/user-bookings" />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
