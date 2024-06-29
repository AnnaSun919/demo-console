import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

// export const LoginPage = () => {
//   return <div>LoginPage</div>;
// };

export default function AuthRouter() {
  console.log("tsting auto rout");
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Login />} path="/login" />
    </Routes>
  );
}
