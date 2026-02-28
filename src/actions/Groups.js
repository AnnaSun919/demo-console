import * as actionTypes from "../constants/actiontypes";
import AdminApi from "../helper/api/Admin";

export const fetchGroups = () => async (dispatch) => {
  dispatch({ type: actionTypes.GROUPS_LOADING });
  try {
    const response = await AdminApi.getAllGroups();

    if (response?.data?.success) {
      dispatch({
        type: actionTypes.GROUPS_FETCH_SUCCESS,
        payload: response.data.groups || [],
      });
    } else {
      dispatch({ type: actionTypes.GROUPS_FETCH_ERROR });
    }
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    dispatch({ type: actionTypes.GROUPS_FETCH_ERROR });
  }
};
