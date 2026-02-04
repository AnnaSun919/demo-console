import * as actionTypes from "./types";
import * as authService from "./auth.service";
import { redirect } from "react-router";

export const login =
  ({ loginData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });

    console.log(loginData)
    const response = await authService.login({ loginData });
    console.log("Testing login ")
    console.log(response)
    if (response&& response.data.success) {
      console.log("Testing login success")
      const auth_state = {
        current: response.data,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      }

      window.localStorage.setItem("auth", JSON.stringify(auth_state));
      window.localStorage.removeItem("isLogout");

      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: response.result,
      });
      redirect('/')
      // dispatch(push('/dashboard'));
    } else {
      console.log("not success")
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };
