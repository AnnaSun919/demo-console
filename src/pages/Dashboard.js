import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import RoleGuard from "@/components/auth/RoleGuard";
import LocalStorageHelper from "../helper/local_storage_helper";
import { logout } from "../actions/Auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_state");
    localStorage.removeItem("auth_role");
    navigate("/login");
  };
  const userRole = LocalStorageHelper.getRole();
  const role = userRole?.role || 'user';
  const userName = userRole?.name || 'User';

  const isAdmin = role === 'admin' || role === 'super_admin';
  const isSuperAdmin = role === 'super_admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Welcome back, {userName}!
              </CardTitle>
              <CardDescription>
                {isAdmin
                  ? "You have administrator access. Manage your system from here."
                  : "Here's an overview of your bookings and quick actions."}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </CardHeader>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/book-room")}>
            <CardContent className="p-6 text-center">
              <CardTitle className="text-lg mb-2">Book a Room</CardTitle>
              <CardDescription>Reserve a meeting room</CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/my-bookings")}>
            <CardContent className="p-6 text-center">
              <CardTitle className="text-lg mb-2">My Bookings</CardTitle>
              <CardDescription>View your reservations</CardDescription>
            </CardContent>
          </Card>

          <RoleGuard allowedRoles={['admin', 'super_admin']}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/user-bookings")}>
              <CardContent className="p-6 text-center">
                <CardTitle className="text-lg mb-2">User Bookings</CardTitle>
                <CardDescription>View and manage all future bookings</CardDescription>
              </CardContent>
            </Card>
          </RoleGuard>

        </div>

        {/* Admin Section */}
        <RoleGuard allowedRoles={['admin', 'super_admin']}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/manage-rooms")}>
              <CardHeader>
                <CardTitle>Manage Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Add, edit, or remove rooms</p>
                <Button variant="outline" className="mt-4 w-full">
                  Go to Rooms
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/user-bookings")}>
              <CardHeader>
                <CardTitle>User Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View and manage all future bookings</p>
                <Button variant="outline" className="mt-4 w-full">
                  View Bookings
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/groups")}>
              <CardHeader>
                <CardTitle>Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Review user groups</p>
                <Button variant="outline" className="mt-4 w-full">
                  View Groups
                </Button>
              </CardContent>
            </Card>
          </div>
        </RoleGuard>

        {/* User Booking Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={() => navigate("/book-room")}>
              Book a New Room
            </Button>
            <Button variant="outline" onClick={() => navigate("/my-bookings")}>
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
