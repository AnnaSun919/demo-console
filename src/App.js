import "./App.css";

import DemoApp from "./DemoApp";
import { BrowserRouter } from "react-router-dom";
import { useMemo, useReducer, createContext } from "react";
import { reducer } from "./reducer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { appinitialState, appcontextReducer } from "./reducer";

const Context = createContext();

const AUTH_INITIAL_STATE = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const auth_state = AUTH_INITIAL_STATE;

const initialState = { auth: auth_state };

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(appcontextReducer, appinitialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <AppContextProvider>
            <DemoApp />
          </AppContextProvider>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
