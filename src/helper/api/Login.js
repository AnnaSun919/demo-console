import apiClient from '../request';
//auth
export default { 

  async login(loginData) {
      return await apiClient.post('login', loginData);
  },

  async logout() {
    return await apiClient.post('logout');
},

}
