import { combineReducers } from "redux";
import authReducer from "./reducers/Login";
import bookingReducer from "./reducers/BookingListPage";

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
});

export default rootReducer;
