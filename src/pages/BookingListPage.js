import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBookings } from '../actions/BookingListPage';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LocalStorageHelper from '../helper/local_storage_helper';

const BookingList = (state) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, isLoading: loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    const admin = LocalStorageHelper.getRole();
    dispatch(getBookings({ userId: admin.id }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <Card className="w-[400px]">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Loading bookings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <Card className="w-[400px]">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Reservations & Bookings</CardTitle>
          <Button variant="outline" onClick={() => navigate("/main")}>
            Back to Home
          </Button>
        </CardHeader>
        <CardContent>
          {bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3">#{booking.id}</td>
                      <td className="p-3">{booking.customerName}</td>
                      <td className="p-3">{booking.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status?.toLowerCase() === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="outline" onClick={() => alert(`Viewing ${booking.id}`)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No bookings found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingList;
