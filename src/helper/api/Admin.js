import apiClient from '../request';

export default {
  // User Management
  async getAllUsers() {
    return await apiClient.get('/admin/all-users');
  },

  async updateUser(id, userData) {
    return await apiClient.put(`/admin/update-user/${id}`, userData);
  },

  async deleteUser(id) {
    return await apiClient.delete(`/admin/delete-user/${id}`);
  },

  // Room Management
  async getRooms() {
    return await apiClient.get('/admin/rooms');
  },

  async getRoomById(roomId) {
    return await apiClient.get('/admin/room', { params: { roomId } });
  },

  async createRoom(roomData) {
    return await apiClient.post('/admin/add-room', roomData);
  },

  async editRoom(roomId, roomData) {
    return await apiClient.put('/admin/edit-room', roomData, { params: { roomId } });
  },

  async deleteRoom(roomId) {
    return await apiClient.delete('/admin/delete-room', { params: { roomId } });
  },

  //room Booking management
  async getAvailableRooms(roomId, date) {
    return await apiClient.get('/admin/available-rooms', {
      params: { roomId, date }
    });
  },

  async getBookRooms(roomId, date) {
    return await apiClient.get('/admin/book-rooms', {
      params: { roomId, date }
    });
  },

  // Group Management (read-only)
  async getAllGroups() {
    return await apiClient.get('/admin/groups');
  },

  // Booking Approval
  async getPendingBookings() {
    return await apiClient.get('/admin/pending-approvals');
  },

  async approveBooking(bookingId) {
    return await apiClient.patch('/admin/approve-booking', null, { params: { bookingId } });
  },

  async rejectBooking(bookingId) {
    return await apiClient.patch('/admin/reject-booking', null, { params: { bookingId } });
  }
};
