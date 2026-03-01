import * as actionTypes from "../constants/actiontypes";

const initialState = {
  bookings: [],
  isLoading: false,
  error: false,
};

const approvalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.APPROVALS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case actionTypes.APPROVALS_FETCH_SUCCESS:
      return {
        ...state,
        bookings: action.payload,
        isLoading: false,
        error: false,
      };
    case actionTypes.APPROVALS_FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case actionTypes.APPROVALS_APPROVE_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.bookingId === action.payload
            ? { ...booking, status: "APPROVED" }
            : booking
        ),
        isLoading: false,
      };
    case actionTypes.APPROVALS_REJECT_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.bookingId === action.payload
            ? { ...booking, status: "REJECTED" }
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

export default approvalsReducer;
