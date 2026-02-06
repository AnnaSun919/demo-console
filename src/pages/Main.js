import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/Auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGetBooking = () => {
    navigate("/bookings");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            {isLoggedIn ? "You are logged in" : "Please log in to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!isLoggedIn && (
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          )}
          <Button variant="secondary" onClick={handleGetBooking} className="w-full">
            Get Booking
          </Button>
          {isLoggedIn && (
            <Button variant="destructive" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
