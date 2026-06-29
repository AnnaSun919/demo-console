import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import LocalStorageHelper from "./helper/local_storage_helper";

const AUTH_INITIAL_STATE = {
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const savedAuth = LocalStorageHelper.getAuthState();
const auth_state = savedAuth ? savedAuth : AUTH_INITIAL_STATE;

const initialState = { auth: auth_state };

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

export default store;
