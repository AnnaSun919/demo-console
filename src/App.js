import "./App.css";

import DemoApp from "./DemoApp";
import { BrowserRouter } from "react-router-dom";
import { useMemo, useReducer, createContext } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { appinitialState, appcontextReducer } from "./reducer";
import MessageHandler from "./components/MessageHandler";
import { Provider as AlertProvider, positions, transitions } from 'react-alert';
import ReactAlertTemplate from "./components/ReactAlertTemplate";

const Context = createContext();

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
          <AlertProvider
            template={ReactAlertTemplate}
            position={positions.BOTTOM_CENTER}
            timeout={5000}
            offset="25px"
            transition={transitions.SCALE}
          >
            <AppContextProvider>
              <MessageHandler />
              <DemoApp />
            </AppContextProvider>
          </AlertProvider>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
