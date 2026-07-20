import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { fetchAllBookings, approveBooking, rejectBooking } from "../actions/Approvals";
import moment from "moment";

const UserBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookings, isLoading } = useSelector((state) => state.approvals);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleApprove = async (bookingId) => {
    dispatch(approveBooking(bookingId));
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm("Are you sure you want to reject this booking?")) return;
    dispatch(rejectBooking(bookingId));
  };

  const getFilteredBookings = () => {
    if (!bookings) return [];
    switch (activeTab) {
      case "pending":
        return bookings.filter((b) => b.status?.toUpperCase() === "PENDING");
      case "approved":
        return bookings.filter((b) => b.status?.toUpperCase() === "APPROVED" || b.status?.toUpperCase() === "CONFIRMED");
      case "rejected":
        return bookings.filter((b) => b.status?.toUpperCase() === "REJECTED" || b.status?.toUpperCase() === "CANCELLED");
      default:
        return bookings;
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "APPROVED":
      case "CONFIRMED":
        return <span className={`${baseClass} bg-green-100 text-green-700`}>Approved</span>;
      case "PENDING":
        return <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "REJECTED":
      case "CANCELLED":
        return <span className={`${baseClass} bg-red-100 text-red-700`}>Rejected</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  const filteredBookings = getFilteredBookings();

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">User Bookings</CardTitle>
            <CardDescription>View and manage all future bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading bookings...</p>
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Room</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Time</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">User</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.bookingId} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{booking.roomName}</p>
                            {booking.title && (
                              <p className="text-sm text-muted-foreground">{booking.title}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">{moment(booking.startAt).format("YYYY-MM-DD")}</td>
                        <td className="p-3">{moment(booking.startAt).format("HH:mm")} - {moment(booking.endAt).format("HH:mm")}</td>
                        <td className="p-3">{getStatusBadge(booking.status)}</td>
                        <td className="p-3">{booking.userName}</td>
                        <td className="p-3 text-right">
                          {booking.status?.toUpperCase() === "PENDING" && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleApprove(booking.bookingId)}>Approve</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleReject(booking.bookingId)}>Reject</Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
