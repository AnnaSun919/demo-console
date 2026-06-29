import * as alertTypes from "../constants/alertTypes";

const initialState = {
  queue: [],
};

export default function alertsReducer(state = initialState, action) {
  switch (action.type) {
    case alertTypes.ALERT_PUSH:
      return {
        ...state,
        queue: [...state.queue, action.payload],
      };
    case alertTypes.ALERT_SHIFT:
      return {
        ...state,
        queue: state.queue.slice(1),
      };
    default:
      return state;
  }
}

