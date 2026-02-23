import * as actionTypes from "../constants/actiontypes";

const initialState = {
  rooms: [],
  roomDetail: null,
  isLoading: false,
  isDetailLoading: false,
  error: false,
};

const roomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ROOMS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case actionTypes.ROOMS_FETCH_SUCCESS:
      return {
        ...state,
        rooms: action.payload,
        isLoading: false,
        error: false,
      };
    case actionTypes.ROOMS_FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case actionTypes.ROOMS_CREATE_SUCCESS:
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
        isLoading: false,
      };
    case actionTypes.ROOMS_UPDATE_SUCCESS:
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room.id === action.payload.id ? { ...room, ...action.payload } : room
        ),
        isLoading: false,
      };
    case actionTypes.ROOMS_DELETE_SUCCESS:
      return {
        ...state,
        rooms: state.rooms.filter((room) => room.id !== action.payload),
        isLoading: false,
      };
    case actionTypes.ROOM_DETAIL_LOADING:
      return {
        ...state,
        isDetailLoading: true,
      };
    case actionTypes.ROOM_DETAIL_SUCCESS:
      return {
        ...state,
        roomDetail: action.payload,
        isDetailLoading: false,
      };
    case actionTypes.ROOM_DETAIL_ERROR:
      return {
        ...state,
        roomDetail: null,
        isDetailLoading: false,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default roomsReducer;
