import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import bookingReducer from "./actions/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
});

export default rootReducer;
