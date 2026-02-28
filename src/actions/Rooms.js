import * as actionTypes from "../constants/actiontypes";
import AdminApi from "../helper/api/Admin";

export const fetchRoomById = (roomId) => async (dispatch) => {
  dispatch({ type: actionTypes.ROOM_DETAIL_LOADING });
  try {
    const response = await AdminApi.getRoomById(roomId);
    if (response?.data?.success) {
      const roomData = response.data.room;
      dispatch({
        type: actionTypes.ROOM_DETAIL_SUCCESS,
        payload: roomData,
      });
      return { success: true, room: roomData };
    }
    dispatch({ type: actionTypes.ROOM_DETAIL_ERROR });
    return { success: false };
  } catch (error) {
    console.error("Failed to fetch room details:", error);
    dispatch({ type: actionTypes.ROOM_DETAIL_ERROR });
    return { success: false };
  }
};

export const fetchRooms = () =>
  async (dispatch) => {
    dispatch({ type: actionTypes.ROOMS_LOADING });
    try {
      const response = await AdminApi.getRooms();

      if (response?.data?.success) {

        dispatch({
          type: actionTypes.ROOMS_FETCH_SUCCESS,
          payload: response.data.rooms || [],
        });
      } else {
        dispatch({ type: actionTypes.ROOMS_FETCH_ERROR });
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      dispatch({ type: actionTypes.ROOMS_FETCH_ERROR });
    }
  };

export const createRoom = (roomData) => async (dispatch) => {
  dispatch({ type: actionTypes.ROOMS_LOADING });
  try {
    const response = await AdminApi.createRoom(roomData);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.ROOMS_CREATE_SUCCESS,
        payload: response.data.room,
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Failed to create room:", error);
    return { success: false };
  }
};

export const editRoom = (roomId, roomData) => async (dispatch) => {
  dispatch({ type: actionTypes.ROOMS_LOADING });
  try {
    const response = await AdminApi.editRoom(roomId, roomData);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.ROOMS_UPDATE_SUCCESS,
        payload: { roomId, ...roomData },
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Failed to edit room:", error);
    return { success: false };
  }
};

export const deleteRoom = (roomId) => async (dispatch) => {
  try {
    const response = await AdminApi.deleteRoom(roomId);
    if (response?.data?.success) {
      dispatch({
        type: actionTypes.ROOMS_DELETE_SUCCESS,
        payload: roomId,
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Failed to delete room:", error);
    return { success: false };
  }
};
