import * as actionTypes from "../constants/actiontypes";

const initialState = {
  availableRooms: [],
  availableSlots: [],
  lastBooking: null,
  isLoading: false,
  error: false,
  bookingSuccess: false,
};

const bookRoomReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.BOOK_ROOM_LOADING:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case actionTypes.BOOK_ROOM_AVAILABLE_ROOMS_SUCCESS:
      return {
        ...state,
        availableRooms: action.payload,
        isLoading: false,
        error: false,
      };
    case actionTypes.BOOK_ROOM_AVAILABLE_SLOTS_SUCCESS:
      return {
        ...state,
        availableSlots: action.payload,
        isLoading: false,
        error: false,
      };
    case actionTypes.BOOK_ROOM_SUCCESS:
      return {
        ...state,
        lastBooking: action.payload,
        isLoading: false,
        error: false,
        bookingSuccess: true,
      };
    case actionTypes.BOOK_ROOM_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case actionTypes.BOOK_ROOM_RESET:
      return {
        ...state,
        availableSlots: [],
        lastBooking: null,
        bookingSuccess: false,
        error: false,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default bookRoomReducer;
