import * as actionTypes from "../constants/actiontypes";
import UserApi from "../helper/api/User";
import { pushAlert } from "./Alerts";


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
      dispatch(pushAlert("Failed to load available rooms.", "error"));
    }
  } catch (error) {
    console.error("Failed to fetch available rooms:", error);
    dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
    dispatch(pushAlert("Failed to load available rooms.", "error"));
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
      dispatch(pushAlert("Failed to load available timeslots.", "error"));
    }
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
    dispatch(pushAlert("Failed to load available timeslots.", "error"));
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
      dispatch(pushAlert("Booking confirmed!", "success"));
      return { success: true };
    }
    dispatch(pushAlert("Booking failed. Please try again.", "error"));
    return { success: false };
  } catch (error) {
    console.error("Failed to book room:", error);
    dispatch({ type: actionTypes.BOOK_ROOM_ERROR });
    dispatch(pushAlert("Booking failed. Please try again.", "error"));
    return { success: false };
  }
};

export const resetBookRoom = () => (dispatch) => {
  dispatch({ type: actionTypes.BOOK_ROOM_RESET });
};
