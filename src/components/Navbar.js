import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import LocalStorageHelper from "../helper/local_storage_helper";
import { logout } from "../actions/Auth";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = LocalStorageHelper.getRole();
  const userName = userRole?.name || "User";

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_state");
    localStorage.removeItem("auth_role");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 shadow-lg z-50" style={{ backgroundColor: 'rgb(255, 254, 237)' }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Logo/Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img src="/bookroomLogo.png" alt="Logo" className="h-12" />
          <span className="text-gray-800 font-bold text-lg">
            Room Booking
          </span>
        </div>

        {/* Right - User Info & Logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Hi, {userName}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
