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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
