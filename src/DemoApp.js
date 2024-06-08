import React from "react";
import AppRouter from "./AppRouter";
import { LoginPage } from "./LoginPage";
import { useMemo, useReducer, createContext, useContext } from "react";
import { initialState, reducer } from "./reducer.js";

// put useContext here
//Login page if is not login
//use usereducer to handle state

const AppContext = createContext();

const DemoApp = () => {
  return <AppRouter />;
};

export default DemoApp;
