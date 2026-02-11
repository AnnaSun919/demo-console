import apiClient from '../request';

export default {

  //admin get all booking
  async getBookings(id) {
    return await apiClient.get(`admin/bookings`);
  }


};