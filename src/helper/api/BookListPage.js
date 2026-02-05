import apiClient from '../request';

export default {

  async getBookings(id) {
  return await apiClient.get(`/bookings?userId=${id}`);
  }


};