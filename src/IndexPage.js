import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Main from "./pages/Main";
import BookingListPage from "./pages/BookingListPage";
import Dashboard from "./pages/Dashboard";
import AdminBookRoom from "./pages/admin/AdminBookRoom";
import BookRoom from "./pages/BookRoom";
import MyBookings from "./pages/MyBookings";
import ManageRooms from "./pages/ManageRooms";
import ApproveBookings from "./pages/ApproveBookings";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function AuthRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Login />} path="/login" />
      <Route element={<Unauthorized />} path="/unauthorized" />

      {/* Authenticated user routes */}
      <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>} path="/dashboard" />
      <Route element={<ProtectedRoute><BookRoom /></ProtectedRoute>} path="/book-room" />
      <Route element={<ProtectedRoute><MyBookings /></ProtectedRoute>} path="/my-bookings" />
      <Route element={<ProtectedRoute><Main /></ProtectedRoute>} path="/main" />
      <Route element={<ProtectedRoute><BookingListPage /></ProtectedRoute>} path="/bookings" />


      {/* Admin routes (admin + superadmin) */}
      <Route element={<ProtectedRoute><AdminBookRoom /></ProtectedRoute>} path="admin/book-room" />
      <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]}><ManageRooms /></ProtectedRoute>} path="/manage-rooms" />
      <Route element={<ProtectedRoute ><ApproveBookings /></ProtectedRoute>} path="/approve-bookings" />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
