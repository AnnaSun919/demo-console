import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

export default function AuthRouter() {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Login />} path="/login" />
    </Routes>
  );
}
