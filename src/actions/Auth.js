import * as actionTypes from "../constants/actiontypes";
import Auth from "../helper/api/Login";
import LocalStorageHelper from "../helper/local_storage_helper";

export const login =
  ({ loginData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const response = await Auth.login(loginData);

    if (response&& response.data.success) {
      const auth_state = {
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      }

      LocalStorageHelper.setRole(response.data.userInfo.role);
      LocalStorageHelper.setUserInfo(response.data.userInfo);
      LocalStorageHelper.setToken(response.data.auth.token);
      LocalStorageHelper.setAuthState(auth_state);
      localStorage.removeItem("isLogout");

      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

  export const logout =
  () =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const response = await Auth.logout();

    if (response&& response.data.success) {

      window.localStorage.clear();
      
      dispatch({
        type: actionTypes.LOGOUT_SUCCESS,
      });
    } else {
      dispatch({
        type: actionTypes.LOGOUT_FAILED,
      });
    }
  };
