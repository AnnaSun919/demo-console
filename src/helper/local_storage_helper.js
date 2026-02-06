
const LocalStorageHelper = {
  setAuthState(auth_state) {
    return localStorage.setItem('auth_state',auth_state);
  },
  getAuthState() {
    const authState = localStorage.getItem('auth_state');
    return authState || null ;
  },
  setRole(user) {
		return localStorage.setItem('auth_role',JSON.stringify(user));
	},
	getRole() {
			const admin = JSON.parse(localStorage.getItem('auth_role'));
			return admin || null;
	},
	// Auth Token
	getToken() {
		return localStorage.getItem('auth_token') || null;
	},
	setToken(token) {
		localStorage.setItem('auth_token', token);
	}
};

export default LocalStorageHelper;
