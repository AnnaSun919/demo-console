import * as actionTypes from "../constants/actiontypes";

const initialState = {
  groups: [],
  isLoading: false,
  error: false,
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GROUPS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case actionTypes.GROUPS_FETCH_SUCCESS:
      return {
        ...state,
        groups: action.payload,
        isLoading: false,
        error: false,
      };
    case actionTypes.GROUPS_FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default groupsReducer;
