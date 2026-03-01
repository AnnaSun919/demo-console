import * as actionTypes from "../constants/actiontypes";
import UserApi from "../helper/api/User";

export const fetchMyBookings =
  ({ userId }) =>
    async (dispatch) => {

      dispatch({
        type: actionTypes.MY_BOOKINGS_LOADING
      });

      const response = await UserApi.getMyBookings(userId);
      if (response?.data?.success) {
        dispatch({
          type: actionTypes.MY_BOOKINGS_FETCH_SUCCESS,
          payload: response.data.bookings,
        });
      } else {
        dispatch({
          type: actionTypes.MY_BOOKINGS_FETCH_ERROR
        });
      }
    };

export const cancelBooking = (bookingId) => async (dispatch) => {
  try {
    const response = await UserApi.cancelBooking(bookingId);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.MY_BOOKINGS_CANCEL_SUCCESS,
        payload: response.data.booking,
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    return { success: false };
  }
};
