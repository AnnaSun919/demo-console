import * as ActionTypes from '../constants/actiontypes';

const INITIAL_STATE = {
  bookings: [],
  isLoading: false,
  error: null,
};

const bookingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.GET_BOOKINGS_LIST_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case ActionTypes.GET_BOOKINGS_LIST_SUCCESS:
      return {
        ...state,
        bookings: action.payload,
        isLoading: false,
        error: null,
      };
    case ActionTypes.GET_BOOKINGS_LIST_ERROR:
      return {
        ...state,
        isLoading: false,
        error: 'Failed to load bookings.',
      };
    default:
      return state;
  }
};

export default bookingReducer;
