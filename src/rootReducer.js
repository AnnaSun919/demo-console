import { combineReducers } from "redux";
import authReducer from "./reducers/Login";
import bookingReducer from "./reducers/BookingListPage";
import usersReducer from "./reducers/Users";
import roomsReducer from "./reducers/Rooms";
import groupsReducer from "./reducers/Groups";
import approvalsReducer from "./reducers/Approvals";
import myBookingsReducer from "./reducers/MyBookings";
import bookRoomReducer from "./reducers/BookRoom";
import alertsReducer from "./reducers/Alerts";

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  users: usersReducer,
  rooms: roomsReducer,
  groups: groupsReducer,
  approvals: approvalsReducer,
  myBookings: myBookingsReducer,
  bookRoom: bookRoomReducer,
  alerts: alertsReducer,
});

export default rootReducer;
