import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import RoleGuard from "@/components/auth/RoleGuard";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Admin Section */}
        <RoleGuard allowedRoles={['admin', 'super_admin']}>
          <h2 className="text-lg font-semibold text-gray-700">Admin Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/user-bookings")}>
              <CardContent className="p-6 text-center">
                <CardTitle className="text-lg mb-2">User Bookings</CardTitle>
                <CardDescription>View and manage all future bookings</CardDescription>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/manage-rooms")}>
              <CardContent className="p-6 text-center">
                <CardTitle className="text-lg mb-2">Manage Rooms</CardTitle>
                <CardDescription>Add, edit, or remove rooms</CardDescription>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/groups")}>
              <CardContent className="p-6 text-center">
                <CardTitle className="text-lg mb-2">Groups</CardTitle>
                <CardDescription>Review user groups</CardDescription>
              </CardContent>
            </Card>
          </div>
        </RoleGuard>
      </div>
    </div>
  );
};

export default Dashboard;
