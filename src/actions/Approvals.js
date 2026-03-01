import * as actionTypes from "../constants/actiontypes";
import AdminApi from "../helper/api/Admin";

export const fetchAllBookings = () => async (dispatch) => {
  dispatch({ type: actionTypes.APPROVALS_LOADING });
  try {
    const response = await AdminApi.getAllBookings();
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.APPROVALS_FETCH_SUCCESS,
        payload: response.data.bookings || [],
      });
    } else {
      dispatch({ type: actionTypes.APPROVALS_FETCH_ERROR });
    }
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    dispatch({ type: actionTypes.APPROVALS_FETCH_ERROR });
  }
};

export const approveBooking = (bookingId) => async (dispatch) => {
  try {
    const response = await AdminApi.approveBooking(bookingId);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.APPROVALS_APPROVE_SUCCESS,
        payload: bookingId,
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Failed to approve booking:", error);
    return { success: false };
  }
};

export const rejectBooking = (bookingId) => async (dispatch) => {
  try {
    const response = await AdminApi.rejectBooking(bookingId);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.APPROVALS_REJECT_SUCCESS,
        payload: bookingId,
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Failed to reject booking:", error);
    return { success: false };
  }
};
