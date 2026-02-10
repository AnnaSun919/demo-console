
const LocalStorageHelper = {
  setAuthState(auth_state) {
		localStorage.setItem('auth_state', JSON.stringify(auth_state));
  },
  getAuthState() {
    return JSON.parse(localStorage.getItem('auth_state'));
  },
  setRole(role) {
		return localStorage.setItem('auth_role',JSON.stringify(role));
	},
	getRole() {
		return JSON.parse(localStorage.getItem('auth_role'));

},
	setUserInfo(user) {
		return localStorage.setItem('auth_user_info',JSON.stringify(user));
	},
	getUserInfo() {
		return JSON.parse(localStorage.getItem('auth_user_info'));
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
