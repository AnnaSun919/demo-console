import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CreateUser from "./pages/CreateUser";
import Main from "./pages/Main";
import BookingListPage from "./pages/BookingListPage";

export default function AuthRouter() {
  return (
    <Routes>
      <Route element={<BookingListPage />} path="/bookings" />
      <Route element={<Login />} path="/login" />
      <Route element={<CreateUser />} path="/create-user" />
      <Route element={<Main />} path="/main" />
    </Routes>
  );
}
