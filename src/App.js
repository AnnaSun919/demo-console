import "./App.css";

import DemoApp from "./DemoApp";
import { BrowserRouter } from "react-router-dom";
import { useMemo, useReducer, createContext, useContext } from "react";
import { initialState, reducer } from "./reducer.js";
import { LoginPage } from "./LoginPage";

// put useContext here
//use usereducer to handle state

const Context = createContext();
const isLogin = false;

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [state, dispatch], [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function App() {
  if (isLogin)
    return (
      <>
        <BrowserRouter>
          <AppContextProvider>
            <DemoApp />
          </AppContextProvider>
        </BrowserRouter>
      </>
    );
  else return <LoginPage />;
}

export default App;
