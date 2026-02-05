import * as actionTypes from "./types";
import * as authService from "./auth.service";

export const login =
  ({ loginData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const response = await authService.login({ loginData });

    if (response&& response.data.success) {
      const auth_state = {
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      }

      window.localStorage.setItem("auth_state", JSON.stringify(auth_state));
      window.localStorage.setItem("auth_role", JSON.stringify(response.data.admit));
      window.localStorage.setItem("auth_token", JSON.stringify(response.data.auth.token));
      window.localStorage.removeItem("isLogout");

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
