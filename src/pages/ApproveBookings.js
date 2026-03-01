import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { fetchPendingBookings, approveBooking, rejectBooking } from "../actions/Approvals";
import moment from "moment";

const ApproveBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pendingBookings, isLoading } = useSelector((state) => state.approvals);

  useEffect(() => {
    dispatch(fetchPendingBookings());
  }, [dispatch]);

  const handleApprove = async (bookingId) => {
    dispatch(approveBooking(bookingId));
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm("Are you sure you want to reject this booking?")) return;
    dispatch(rejectBooking(bookingId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Approve Bookings</CardTitle>
              <CardDescription>Review and approve pending booking requests</CardDescription>
            </div>
            {pendingBookings.length > 0 && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {pendingBookings.length} pending
              </span>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading pending bookings...</p>
            ) : pendingBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Room</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Time</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.map((booking) => (
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
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleApprove(booking.bookingId)}>Approve</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(booking.bookingId)}>Reject</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending bookings to review</p>
                <p className="text-sm text-muted-foreground mt-2">All booking requests have been processed</p>
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

export default ApproveBookings;
