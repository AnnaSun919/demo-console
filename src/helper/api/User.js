import apiClient from '../request';

export default {
  async getUserDetails() {
    return await apiClient.get('/user/user-details');
  },

  async getMyBookings(userId) {
    return await apiClient.get('/my-bookings', { params: { userId } });
  },

  async bookRoom(bookingData) {
    return await apiClient.post('/user/book-room', bookingData);
  },

  async cancelBooking(bookingId) {
    return await apiClient.post('/cancel-booking', null, { params: { bookingId } });
  },

  async getAvailableRooms(userId) {
    return await apiClient.get(`/user/available-rooms?userId=${userId}`);
  },

  async getAvailableTimeslots(userId, roomId, date) {
    return await apiClient.get('/user/available-timeslots', {
      params: { userId, roomId, date }
    });
  }
};
