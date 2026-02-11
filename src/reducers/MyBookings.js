import * as actionTypes from "../constants/actiontypes";

const initialState = {
  bookings: [],
  isLoading: false,
  error: false,
};

const myBookingsReducer = (state = initialState, action) => {
  console.log("testing my booking reducer");
  switch (action.type) {
    case actionTypes.MY_BOOKINGS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case actionTypes.MY_BOOKINGS_FETCH_SUCCESS:
      return {
        ...state,
        bookings: action.payload,
        isLoading: false,
        error: false,
      };
    case actionTypes.MY_BOOKINGS_FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case actionTypes.MY_BOOKINGS_CANCEL_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload
            ? { ...booking, status: "cancelled" }
            : booking
        ),
        isLoading: false,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default myBookingsReducer;
