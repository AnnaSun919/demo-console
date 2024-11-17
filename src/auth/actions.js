import * as actionTypes from "./types";
import * as authService from "./auth.service";

export const login =
  ({ loginData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });

    const data = await authService.login({ loginData });

    if (data.success === true) {
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };

      window.localStorage.setItem("auth", JSON.stringify(auth_state));
      window.localStorage.removeItem("isLogout");

      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };
