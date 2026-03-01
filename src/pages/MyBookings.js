import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { fetchMyBookings, cancelBooking } from "../actions/MyBookings";
import LocalStorageHelper from "../helper/local_storage_helper"
import moment from "moment";

const MyBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookings, isLoading } = useSelector((state) => state.myBookings);
  const [activeTab, setActiveTab] = useState("upcoming");
  const user = LocalStorageHelper.getUserInfo();

  useEffect(() => {
    dispatch(fetchMyBookings({ userId: user.id }));
  }, [dispatch]);

  const getFilteredBookings = () => {
    if (!bookings) return [];
    switch (activeTab) {
      case "upcoming":
        return bookings.filter((b) =>
          moment(b.endAt).isAfter(moment()) && b.status?.toUpperCase() !== 'CANCELLED');
      case "past":
        return bookings.filter((b) => moment(b.endAt).isBefore(moment()));
      default:
        return bookings;
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "CONFIRMED":
      case "APPROVED":
        return <span className={`${baseClass} bg-green-100 text-green-700`}>Confirmed</span>;
      case "PENDING":
        return <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "CANCELLED":
      case "REJECTED":
        return <span className={`${baseClass} bg-red-100 text-red-700`}>Cancelled</span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    dispatch(cancelBooking(bookingId));
  };

  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "all", label: "All" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Bookings</CardTitle>
            <CardDescription>
              View and manage your room reservations
          </CardDescription>
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

            {/* Booking Cards */}
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            ) : getFilteredBookings().length > 0 ? (
              <div className="space-y-4">
                {getFilteredBookings().map((booking) => (
                  <Card key={booking.bookingId} className="bg-muted">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.roomName}</h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          {booking.title && (
                            <p className="text-sm text-muted-foreground">
                              {booking.title}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Date: {moment(booking.startAt).format("YYYY-MM-DD")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Time: {moment(booking.startAt).format("HH:mm")} - {moment(booking.endAt).format("HH:mm")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(booking.status?.toUpperCase() === "PENDING" || booking.status?.toUpperCase() === "CONFIRMED") &&
                            moment(booking.startAt).isAfter(moment()) && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.bookingId)}
                              >
                                Cancel
                              </Button>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings found</p>
                <Button className="mt-4" onClick={() => navigate("/book-room")}>
                  Book a Room
              </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/book-room")}>
            Book a New Room
        </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
        </Button>
        </div>
      </div>
    </div>
  )
};

export default MyBookings;
