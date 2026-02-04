import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { getBookings } from '../actions/BookingListPage';

const BookingList = () => {

  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchBookings = async () => {
      try {

        setLoading(true);

        dispatch(getBookings({ userId: "8cb8067b-bc96-4880-8fa0-61e858fc30c3"}));
        // Replace with your actual API endpoint: e.g., fetch('/api/bookings')
        // const response = await fetch('https://jsonplaceholder.typicode.com/users'); 
        // const data = await response.json();
        
        // Mapping dummy data to a booking format
        // const formattedData = data.map(item => ({
        //   id: item.id,
        //   customerName: item.name,
        //   date: '2026-02-15', // Placeholder date
        //   status: item.id % 2 === 0 ? 'Confirmed' : 'Pending',
        // }));

        // setBookings(formattedData);
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="loader">Loading bookings...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="booking-container">
      <h2>Reservations & Bookings</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>#{booking.id}</td>
              <td>**{booking.customerName}**</td>
              <td>{booking.date}</td>
              <td>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <button onClick={() => alert(`Viewing ${booking.id}`)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookings.length === 0 && <p>No bookings found.</p>}
    </div>
  );
};

export default BookingList;