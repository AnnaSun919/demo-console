import apiClient from './request';

// export default {
// 	async getBookings(id) {
// 		const res = await request.get(`/admin/admins/id?id=${id}`);
// 		return res;
// 	}
// };

// Group all user-related APIs together
export const BookingService = {
  getBookings(id) {
  return apiClient.get(`/bookings?userId=${id}`);
  }
};