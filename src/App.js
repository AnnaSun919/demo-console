import "./App.css";

import DemoApp from "./DemoApp";
import { BrowserRouter } from "react-router-dom";
import { useMemo, useReducer, createContext, useContext } from "react";
import { initialState, reducer } from "./reducer.js";
import AuthRouter, { LoginPage } from "./LoginPage";

// put useContext here
//use usereducer to handle state

const Context = createContext();

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AppContextProvider>
          <DemoApp />
        </AppContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
