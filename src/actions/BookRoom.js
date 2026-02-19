import * as actionTypes from "../constants/actiontypes";
import UserApi from "../helper/api/User";


//admin
export const fetchAvailableRooms = ({ userId }) => async (dispatch) => {
  dispatch({ type: actionTypes.BOOK_ROOM_LOADING });
  try {
    const response = await UserApi.getAvailableRooms(userId);

    console.log("testing book room ");
    console.log(response);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.BOOK_ROOM_AVAILABLE_ROOMS_SUCCESS,
        payload: response.data.rooms || [],
      });
    } else {
      dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
    }
  } catch (error) {
    console.error("Failed to fetch available rooms:", error);
    dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
  }
};

export const fetchAvailableTimeslots = (userId, roomId, date) => async (dispatch) => {
  dispatch({ type: actionTypes.BOOK_ROOM_LOADING });
  try {
    const response = await UserApi.getAvailableTimeslots(userId, roomId, date);

    if (response?.data?.success) {
      dispatch({
        type: actionTypes.BOOK_ROOM_AVAILABLE_SLOTS_SUCCESS,
        payload: response.data.timeslots || [],
      });
    } else {
      dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
    }
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
  }
};

export const bookRoom = (bookingData) => async (dispatch) => {
  dispatch({ type: actionTypes.BOOK_ROOM_LOADING });
  try {
    const response = await UserApi.bookRoom(bookingData);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.BOOK_ROOM_SUCCESS,
        payload: response.data.booking,
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Failed to book room:", error);
    dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
    return { success: false };
  }
};

export const resetBookRoom = () => (dispatch) => {
  dispatch({ type: actionTypes.BOOK_ROOM_RESET });
};
